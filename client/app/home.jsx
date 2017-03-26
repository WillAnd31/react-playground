import * as _ from 'lodash';
import React from 'react';

import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import AutoRenewIcon from 'material-ui/svg-icons/action/autorenew';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';

import Welcome from './welcome';

const localStorageSettingsField = 'will.settings';
const defaultSubReddit = 'astrophotography';
const imageRegex = (/\.(gif|jpe?g|tiff|png)$/i)
const styles = {
	homeApp: {
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100vh',
		minWidth: '100vw',
		backgroundSize: 'cover',
		backgroundColor: 'rgba(0,0,0,0.8)',
	},
	settingsButton: {
		position: 'absolute',
		top: '10px',
		left: '10px'
	},
	reloadButton: {
		position: 'absolute',
		top: '10px',
		right: '10px'
	},
	settingsModal: {},
	settingsList: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
};

export default class Home extends React.Component {
	constructor (props) {
		super(props);

		this.setBackgroundImage = this.setBackgroundImage.bind(this);
		this.loadImage = this.loadImage.bind(this);
		this.openSettings = this.openSettings.bind(this);
		this.getSettingsModal = this.getSettingsModal.bind(this);
		this.handleSettingsClose = this.handleSettingsClose.bind(this);
		this.getSettings = this.getSettings.bind(this);
		this.setSettings = this.setSettings.bind(this);
		this.updateSettings = this.updateSettings.bind(this);
		this.getLoadingSnack = this.getLoadingSnack.bind(this);
		this.openLoading = this.openLoading.bind(this);
		this.closeLoading = this.closeLoading.bind(this);

		this.state = {
			styles,
			loading: false,
			loadingMsg: '',
			settingsOpen: false,
			settings: this.getSettings(),
			imageUrl: ''
		};
	}

	componentDidMount () {
		this.setBackgroundImage();
	}

	setBackgroundImage (e) {
		this.openLoading('Loading Image');

		fetch('https://www.reddit.com/r/' + this.state.settings.subReddit + '.json')
			.then(res => res.json())
			.then(res => _.filter(res.data.children, child => imageRegex.test(child.data.url)))
			.then(children => {
				var randomPost = _.sample(children);
				return this.loadImage(randomPost.data.url)
					.then(() => randomPost.data.url);
			})
			.then(url => {
				let state = _.cloneDeep(this.state);
				state.imageUrl = url;
				state.styles.homeApp.backgroundImage = 'url(' + url + ')';
				this.setState(state);
			})
			.catch(err => {
				this.openLoading('Failed to get image');
				return Promise.reject(false);
			});
	}

	loadImage (url) {
		return fetch(url, { mode: 'no-cors' })
			.catch(err => {
				this.openLoading('Failed to get image');
				return Promise.reject(false);
			});
	}

	getSettings () {
		var settings = localStorage.getItem(localStorageSettingsField);
		if (!settings) return {};

		settings = JSON.parse(settings);
		if (!settings.subReddit) settings.subReddit = defaultSubReddit;
		if (!settings.name) settings.name = 'Enter Name';

		return settings;
	}

	setSettings (settings) {
		localStorage.setItem(localStorageSettingsField, JSON.stringify(settings));
		this.setState({ settings: this.getSettings() });
	}

	openLoading (loadingMsg) {
		this.setState({ loadingMsg, loading: true });
	}

	closeLoading () {
		this.setState({ loadingMsg: '', loading: false });
	}

	openSettings () {
		this.setState({ settingsOpen: true });
	}

	handleSettingsClose () {
		this.setState({ settingsOpen: false });
	}

	updateSettings (field) {
		return (e, val) => {
			var settings = _.cloneDeep(this.state.settings);
			settings[field] = val;
			this.setSettings(settings);
		};
	}

	getSettingsModal () {
		return <Dialog style={styles.settingsModal}
			modal={false}
			onRequestClose={this.handleSettingsClose}
			open={this.state.settingsOpen}>

			<div style={styles.settingsList}>
				<TextField floatingLabelText="Name"
					fullWidth={true}
					defaultValue={this.state.settings.name}
					onChange={this.updateSettings('name')}/>
				<TextField floatingLabelText="Subreddit"
					fullWidth={true}
					defaultValue={this.state.settings.subReddit}
					onChange={this.updateSettings('subReddit')}
					hintText="Ex: spaceporn, astrophotography"/>
			</div>
		</Dialog>
	}

	getLoadingSnack () {
		return <Snackbar
			open={this.state.loading}
			message={this.state.loadingMsg}
			autoHideDuration={1000}
			onRequestClose={this.closeLoading}
		/>
	}

	render () {
		return <div style={this.state.styles.homeApp} className="home-app">
			<Paper zDepth={3} circle={true} style={styles.settingsButton}>
				<IconButton onClick={this.openSettings}><SettingsIcon/></IconButton>
			</Paper>
			<Paper zDepth={3} circle={true} style={styles.reloadButton}>
				<IconButton onClick={this.setBackgroundImage}><AutoRenewIcon/></IconButton>
			</Paper>

			<Welcome name={this.state.settings.name} imageUrl={this.state.imageUrl}/>

			{this.getSettingsModal()}
			{this.getLoadingSnack()}
		</div>
	}
}