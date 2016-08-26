import React, { Component } from 'react';
import './App.css';

class App extends Component {
	constructor(){
		super();
		this.state = {
			users: {}
		}
	}

	componentWillMount(){
		this.setState({
			users: this.props.user
		});
	}

	componentWillReceiveProps(){
		this.setState({
			users: this.props.users
		});
	}

	_singleUserGrid(){
		let users = this.state.users;
		let userGrid = [];

		for (let property in users) {
			if (users.hasOwnProperty(property)) {
				let user = users[property];
				
				let name = (user.name) ? user.name : user.login;
				name = this._capitalizeFirstLetter(name);
				let followers = (user.followers) ? user.followers : 'Not Available';
				let location = (user.location) ? user.location : 'Not Available';
				let image = (user.avatar_url) ? user.avatar_url : '';

				userGrid.push(
					<a href={user.html_url}>
						<div key={user.id} className="column grid_3 user_card">
							<span className="delete_user"><i className="fa fa-times" aria-hidden="true"></i></span>
							<img src={image} className="user_image" role="presentation"/>
							<p className="user_name">{name}</p>
							<p>Location: {location}</p>
							<p>Followers: {followers}</p>
						</div>
					</a>
				);				
			}
		}
		
		return userGrid;
	}

	_capitalizeFirstLetter(string) {
		if (string) {
	    	return string.charAt(0).toUpperCase() + string.slice(1);			
		}
	}

	render(){
		return (
			<div>
				<div className="row">

				</div>
				<div className="row">
					{this._singleUserGrid()}
				</div>
			</div>
		);
	}
}

export default App;