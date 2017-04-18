import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

const weatherSettingsField = 'will.weatherSettings';
const siteURL = 'https://local.novisecurity.com:3000/v1';
const defaults = {
	location: false,
	weather: false
};
const styles = {
	container: {
		backgroundColor: 'rgba(255,255,255,0.8)',
		padding: '1em',
		margin: '0.5em',
		minWidth: '30em',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	title: {
		fontSize: '2em',
		textAlign: 'center',
		marginBottom: '0.5em'
	}
};

export default class Weather extends React.Component {
	constructor (props) {
		super(props);

		this.getSettings = this.getSettings.bind(this);
		this.showWeather = this.showWeather.bind(this);
		this.askPermission = this.askPermission.bind(this);
		this.getLocation = this.getLocation.bind(this);
		this.getWeather = this.getWeather.bind(this);

		this.state = {
			settings: this.getSettings()
		};
	}

	getSettings () {
		var settings = localStorage.getItem(weatherSettingsField);
		return settings ? JSON.parse(settings) : defaults;
	}

	updateSettings (settings) {
		var pastSettings = _.cloneDeep(this.getSettings());
		_.merge(pastSettings, settings);
		localStorage.setItem(weatherSettingsField, JSON.stringify(pastSettings));
		this.setState({ settings: pastSettings });
		console.log('hi', pastSettings);
		return pastSettings;
	}

	showWeather () {
		if (!this.state.settings.weather) {
			this.getWeather();
			return <h1>Getting weather</h1>;
		}

		console.log('hi', this.state.settings.weather);
		// https://codepen.io/joshbader/pen/EjXgqr
		return <div>

			<h1>Weather</h1>

			{/*<div className="weather-icon sun-shower">
				<div className="cloud"></div>
				<div className="sun">
					<div className="rays"></div>
				</div>
				<div className="rain"></div>
			</div>

			<div className="weather-icon thunder-storm">
				<div className="cloud"></div>
				<div className="lightning">
					<div className="bolt"></div>
					<div className="bolt"></div>
				</div>
			</div>

			<div className="weather-icon cloudy">
				<div className="cloud"></div>
				<div className="cloud"></div>
			</div>

			<div className="weather-icon flurries">
				<div className="cloud"></div>
				<div className="snow">
					<div className="flake"></div>
					<div className="flake"></div>
				</div>
			</div>

			<div className="weather-icon sunny">
				<div className="sun">
					<div className="rays"></div>
				</div>
			</div>

			<div className="weather-icon rainy">
				<div className="cloud"></div>
				<div className="rain"></div>
			</div>*/}
		</div>;
	}

	getWeather () {
		let getWeatherAsync = () => Promise.resolve(this.state.settings.location || this.getLocation())
			.then(loc => fetch(siteURL + '/weather/' + loc.lat + '/' + loc.long))
			.then(res => res.json());

		return Promise.resolve(this.state.settings.weather || getWeatherAsync())
			.then(weather => this.updateSettings({ weather }))
			.catch(err => console.log('err', err));
	}

	getLocation () {
		console.log('gettingloc');
		return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(pos => resolve(pos)));
	}

	askPermission () {
		this.getLocation()
			.then(loc => this.updateSettings({
				location: {
					lat: loc.coords.latitude,
					long: loc.coords.longitude
				}
			}));
	}

	render () {
		return <Paper style={styles.container} zDepth={3}>
			<h1 style={styles.title}>Weather</h1>

			{this.state.settings.location
				? this.showWeather()
				: <RaisedButton label="Get Weather" onClick={this.askPermission} primary={true}/>}
		</Paper>
	}
}
