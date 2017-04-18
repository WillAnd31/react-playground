import React from 'react';

export default class Background extends React.Component {
	constructor (props) {
		super(props);
	}

	render () {
		return <div style={{
			backgroundImage: 'url(' + this.props.imageUrl + ')',
			backgroundColor: 'rgba(0,0,0,0.8)',
			backgroundSize: 'cover',
			position: 'absolute',
			zIndex: '-100',
			top: 0,
			bottom: 0,
			right: 0,
			left: 0
		}}></div>
	}
}