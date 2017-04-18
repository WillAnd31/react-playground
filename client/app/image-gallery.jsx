import * as _ from 'lodash';
import React from 'react';

import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';

import ImageThumbnail from './image-thumbnail';

const imageRegex = (/\.(gif|jpe?g|tiff|png)$/i);
const queriesNameSpace = 'will.queries';
const endpoint = 'https://react.willand.co';
const styles = {
	modal: {
		padding: 0
	},
	tab: {
		padding: '0 1em 1em'
	},
	form: {
		display: 'flex',
		alignItems: 'center'
	},
	thumbnails: {
		paddingTop: '1em',
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		alignItems: 'center'
	}
};

export default class ImageGallery extends React.Component {
	constructor (props) {
		super(props);

		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleRedditChange = this.handleRedditChange.bind(this);
		this.getSubredditImages = this.getSubredditImages.bind(this);
		this.getRedditTab = this.getRedditTab.bind(this);
		this.handleNasaChange = this.handleNasaChange.bind(this);
		this.getNasaImages = this.getNasaImages.bind(this);
		this.getNasaTab = this.getNasaTab.bind(this);

		this.getSavedQueries = this.getSavedQueries.bind(this);
		this.updateSavedQueries = this.updateSavedQueries.bind(this);

		let queries = this.getSavedQueries();

		this.state = {
			redditImgs: [],
			nasaImgs: [],
			queries
		};
	}

	componentDidMount () {
		this.getSubredditImages(this.state.queries.redditQuery);
		this.getNasaImages(this.state.queries.nasaQuery);
	}

	getSavedQueries () {
		let queries = localStorage.getItem(queriesNameSpace);
		if (!queries) {
			queries = { redditQuery: 'astrophotography', nasaQuery: 'nebula' };
			return this.updateSavedQueries(queries);
		} else return JSON.parse(queries);
	}

	updateSavedQueries (queries) {
		localStorage.setItem(queriesNameSpace, JSON.stringify(queries));
		return queries;
	}

	handleRedditChange (event) {
		event.preventDefault();
		this.getSubredditImages(this.state.queries.redditQuery);
	}

	handleNasaChange (event) {
		event.preventDefault();
		this.getNasaImages(this.state.queries.nasaQuery);
	}

	handleSearchChange (field) {
		return event => {
			let queries = _.cloneDeep(this.state.queries);
			queries[field] = event.target.value;
			this.setState({ queries: this.updateSavedQueries(queries) });
		}
	}

	getSubredditImages (subreddit) {
		fetch('https://www.reddit.com/r/' + subreddit + '.json')
			.then(res => res.json())
			.then(res => {
				return _.chain(res.data.children)
					.filter(child => imageRegex.test(child.data.url))
					.map(child => child.data.url.replace(/http\:/, 'https:')).value();
			})
			.catch(err => [])
			.then(redditImgs => this.setState({ redditImgs }));
	}

	getNasaImages (query) {
		fetch(endpoint + '/v1/nasa?q=' + encodeURI(query))
			.then(res => res.json())
			.catch(err => [])
			.then(nasaImgs => this.setState({ nasaImgs }));
	}

	getNasaTab () {
		return <Tab label="NASA">
			<div style={styles.tab}>
				<form onSubmit={this.handleNasaChange} style={styles.form}>
					<TextField fullWidth={true}
						value={this.state.queries.nasaQuery}
						onChange={this.handleSearchChange('nasaQuery')}
						hintText="Type of image"
						floatingLabelText="Search"/>
					<RaisedButton type="submit" label="Search" primary={true}/>
				</form>

				<div style={styles.thumbnails}>
					{this.state.nasaImgs.map((imgUrl, i) => (<ImageThumbnail key={i} src={imgUrl} onClick={this.props.onSelectImage}/>))}
				</div>
			</div>
		</Tab>
	}

	getRedditTab () {
		return <Tab label="Reddit">
			<div style={styles.tab}>
				<form onSubmit={this.handleRedditChange} style={styles.form}>
					<TextField fullWidth={true}
						value={this.state.queries.redditQuery}
						onChange={this.handleSearchChange('redditQuery')}
						hintText="Ex: spaceporn, astrophotography"
						floatingLabelText="Subreddit"/>
					<RaisedButton type="submit" label="Search" primary={true}/>
				</form>

				<div style={styles.thumbnails}>
					{this.state.redditImgs.map((imgUrl, i) => (<ImageThumbnail key={i} src={imgUrl} onClick={this.props.onSelectImage}/>))}
				</div>
			</div>
		</Tab>
	}

	render () {
		return <Dialog bodyStyle={styles.modal}
			onRequestClose={this.props.handleClose}
			open={this.props.open}
			autoScrollBodyContent={true}
			modal={false}>

			<Tabs>
				{this.getRedditTab()}
				{this.getNasaTab()}
			</Tabs>
		</Dialog>
	}
}