import moment from 'moment';

import React from 'react';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import Paper from 'material-ui/Paper';

const styles = {
	container: {
		backgroundColor: 'rgba(255,255,255,0.8)',
		padding: '1em',
		margin: '0.5em',
		minWidth: '30em'
	},
	welcomeTitle: {
		fontSize: '2em',
		textAlign: 'center',
		margin: '0.5em 1em 0.5em'
	},
	dateTitle: {
		fontSize: '2em',
		textAlign: 'center',
		margin: '0.5em 1em 0.5em'
	}
};

export default class Welcome extends React.Component {
	constructor (props) {
		super(props);

		this.getWelcome = this.getWelcome.bind(this);
		this.getDate = this.getDate.bind(this);
	}

	getWelcome () {
		let now = new Date();
		let hours = now.getHours();
		let timeWelcome;

		if (hours >= 0 && hours < 11) timeWelcome = 'Morning';
		else if (hours >= 11 && hours < 15) timeWelcome = 'Afternoon';
		else if (hours >= 15 && hours < 23) timeWelcome = 'Evening';

		return <h1 style={styles.welcomeTitle}>Good {timeWelcome} {this.props.name}</h1>
	}

	getDate () {
		let now = moment().format('MMM Do, YYYY')
		return <h1 style={styles.dateTitle}>{now}</h1>
	}

	render () {
		return <Paper style={styles.container} zDepth={3}>
			{this.getWelcome()}
			{this.getDate()}
		</Paper>
	}
}