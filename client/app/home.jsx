import * as _ from 'lodash';
import React from 'react';

import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import ImageCollections from 'material-ui/svg-icons/image/collections';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';

import Welcome from './welcome';
import Background from './background';
import Weather from './weather';
import ImageGallery from './image-gallery';

const localStorageSettingsField = 'will.settings';
const imageRegex = (/\.(gif|jpe?g|tiff|png)$/i);
const defaults = {
	name: 'Enter Name',
	imageUrl: 'https://i.redd.it/oz6wdb38h5ny.jpg'
};
const styles = {
	homeApp: {
		boxSizing: 'border-box',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100vh',
		minWidth: '100vw'
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

		this.openModal = this.openModal.bind(this);
		this.getSettingsModal = this.getSettingsModal.bind(this);
		this.handleModalClose = this.handleModalClose.bind(this);
		this.getSettings = this.getSettings.bind(this);
		this.setSettings = this.setSettings.bind(this);
		this.updateSettings = this.updateSettings.bind(this);
		this.getLoadingSnack = this.getLoadingSnack.bind(this);
		this.openLoading = this.openLoading.bind(this);
		this.closeLoading = this.closeLoading.bind(this);
		this.getImageGalleryModal = this.getImageGalleryModal.bind(this);
		this.handleSelectImage = this.handleSelectImage.bind(this);

		var settings = this.getSettings();

		this.state = {
			styles,
			settings,
			loading: false,
			loadingMsg: '',
			settingsOpen: false,
			imageGalleryOpen: false
		};
	}

	getSettings () {
		var settings = localStorage.getItem(localStorageSettingsField);
		settings = settings ? JSON.parse(settings) : {};

		if (!settings.imageUrl) settings.imageUrl = defaults.imageUrl;
		if (!settings.name) settings.name = defaults.name;

		return settings;
	}

	setSettings (settings) {
		var updatedSettings = this.getSettings();
		_.merge(updatedSettings, settings);
		var state = _.cloneDeep(this.state);
		localStorage.setItem(localStorageSettingsField, JSON.stringify(updatedSettings));
		state.settings = updatedSettings;
		this.setState(state);
	}

	openLoading (loadingMsg) {
		this.setState({ loadingMsg, loading: true });
	}

	closeLoading () {
		this.setState({ loadingMsg: '', loading: false });
	}

	openModal (field) {
		return () => this.setState({ [field]: true });
	}

	handleModalClose (field) {
		return () => this.setState({ [field]: false });
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
			onRequestClose={this.handleModalClose('settingsOpen')}
			open={this.state.settingsOpen}>

			<div style={styles.settingsList}>
				<TextField floatingLabelText="Name"
					fullWidth={true}
					defaultValue={this.state.settings.name}
					onChange={this.updateSettings('name')}/>

			</div>
		</Dialog>
	}

	handleSelectImage (imageUrl) {
		this.setSettings({ imageUrl });
		this.setState({ imageGalleryOpen: false });
	}

	getImageGalleryModal () {
		return <ImageGallery open={this.state.imageGalleryOpen} onSelectImage={this.handleSelectImage} handleClose={this.handleModalClose('imageGalleryOpen')}/>
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
				<IconButton onClick={this.openModal('settingsOpen')}><SettingsIcon/></IconButton>
			</Paper>
			<Paper zDepth={3} circle={true} style={styles.reloadButton}>
				<IconButton onClick={this.openModal('imageGalleryOpen')}><ImageCollections/></IconButton>
			</Paper>

			<Background imageUrl={this.state.settings.imageUrl}/>
			<Welcome name={this.state.settings.name}/>
			{/*<Weather/>*/}

			{this.getSettingsModal()}
			{this.getImageGalleryModal()}
			{this.getLoadingSnack()}

			<a style={{
				color: 'rgba(255,255,255,0.5)',
				position: 'absolute',
				bottom: '5px',
				left: '5px'
			}} href={this.state.settings.imageUrl}>Image Source</a>
		</div>
	}
}