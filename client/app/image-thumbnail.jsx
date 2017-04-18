import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
	container: {
		overflow: 'hidden',
		cursor: 'pointer',
		margin: '0.5em'
	},
	thumbnail: {
		width: '10em'
	}
};

export default class ImageThumbnail extends React.Component {
	constructor (props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick () {
		this.props.onClick(this.props.src)
	}

	render () {
		return <Paper onClick={this.handleClick} zDepth={2} style={styles.container}>
			<img style={styles.thumbnail} src={this.props.src}/>
		</Paper>
	}
}