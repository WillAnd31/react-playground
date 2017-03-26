import React from 'react';
import { BrowserRouter, Redirect, Route, Link } from 'react-router-dom'

import injectTapEventPlugin from 'react-tap-event-plugin';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
injectTapEventPlugin();

import Home from './home';
import Todo from './todo';

const routes = [
	{
		path: '/home',
		name: 'Home',
		component: Home
	},
	{
		path: '/todo',
		name: 'To Do',
		component: Todo
	}
];

const styles = {
	navBar: {
		position: 'fixed',
		backgroundColor: 'rbga(0,0,0,0)',
		boxShadow: 'none'
	}
};

export default class Index extends React.Component {
	constructor (props, context) {
		super(props, context);

		this.getRouter = this.getRouter.bind(this);
		this.navEl = this.createNavIcon();
	}

	createNavIcon () {
		return <IconMenu iconButtonElement={<IconButton style={{ borderRadius: '100%', backgroundColor: 'white' }}><SettingsIcon/></IconButton>}
			anchorOrigin={{horizontal: 'left', vertical: 'top'}}
			targetOrigin={{horizontal: 'left', vertical: 'top'}}>

			{routes.map((route, i) => {
				return <MenuItem containerElement={<Link to={route.path}/>} key={i} primaryText={route.name}/>
			})}

		</IconMenu>
	}

	getRouter () {
		return <BrowserRouter>
			<div className="router">
				{/*<AppBar style={styles.navBar}
					iconElementLeft={this.navEl}/>*/}

				{routes.map((route, i) => <Route key={i} path={route.path} component={route.component}/>)}

				<Redirect from="/" to="/home"/>
			</div>
		</BrowserRouter>
	}

	render () {
		return <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
			<div> {this.getRouter()} </div>
		</MuiThemeProvider>
	}
}