import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

class App extends Component {
	constructor(){
		super();
		this.state = {
			username: '',
			users: {},
			sortBy: 'NAME',
		}
	}

	componentWillMount(){
		let users = JSON.parse(localStorage.getItem('users') || '{}');
		this.setState({
			users: users
		});
	}

	componentWillUnmount(){
	}

	// USER ACTIONS
	_onChangeName(event, index, value){
		this.setState({
			username: event.target.value
		});
	}

	_addUser(event){
		let userName = this.state.username;
		if (!userName) {
			return false;
		}

		this._makeAjaxCall(userName);
	}

	_deleteUser(id){
		let users = this.state.users;
		delete users[id];

		localStorage.setItem('users', JSON.stringify(users));
		this.setState({users: users});
	}

	// UPDATE LOCAL STORAGE AS WELL AS STATE VARIABLE
	_updateUsers(data){
		let users = JSON.parse(localStorage.getItem('users') || '{}');
		users[data.id] = data;

		localStorage.setItem('users', JSON.stringify(users));

		this.setState({
			users: users
		});
		alert("Successfully Updated User List.");
	}

	/* HELPER METHODS */
	_capitalizeFirstLetter(string) {
		if (string) {
	    	return string.charAt(0).toUpperCase() + string.slice(1);			
		}
	}
	
	_changeSortBy(sortBy){
		this.setState({sortBy: sortBy});
	}

	_getSortedUser(){
		let users = this.state.users;
		let sortBy = this.state.sortBy;
		let sortingArr = [];
		let newUserList = {};
		
		/* CONVERTING OBJECT TO ARRAY FOR MAKING SORT EASIER */
		for (let i in users){
			if (users.hasOwnProperty(i)){
				sortingArr.push(users[i]);
			} 
		}

		switch(sortBy) {
			case "NAME" :
				sortingArr.sort(function(a, b){
					var x = a.login.toLowerCase();
				    var y = b.login.toLowerCase();
				    return x < y ? -1 : x > y ? 1 : 0;
				});
				break;	
			case "LOCATION" :
				sortingArr.sort(function(a, b){
					var x = (a.location != null) ? a.location.toLowerCase() : "na" ;
				    var y = (b.location != null) ? b.location.toLowerCase() : "na" ;
				  	return x < y ? -1 : x > y ? 1 : 0;
				});
				break;	
			case "FOLLOWER" :
				sortingArr.sort(function(a, b){
				  return a.followers < b.followers;
				});
				break;	
			default:
				return users;
		}

		/* CONVERTING SORTED ARRAY BACK TO OBJECT */
		sortingArr.map((el) => {
			newUserList[el.id] = el;
			return true;
		});		
		return sortingArr;
	}

	_makeAjaxCall(name){
		$.ajax({
			url: 'https://api.github.com/users/'+name,
			method: 'GET',
			data: '',
			dataType: 'json',
			contentType: "application/x-www-form-urlencoded",
			success: this._updateUsers.bind(this),
			error: function(jqXhr,textStatus,error){
				alert(error);       
			}
		});
	}	

	// CARD VIEW FOR A SINGLE USER
	_singleUserGrid(){
		let users = this._getSortedUser();
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
					<div key={user.id} className="column grid_3">
						<div className="user_card">
							<span className="delete_user" onClick={this._deleteUser.bind(this, user.id)}><i className="fa fa-times" aria-hidden="true"></i></span>
							<a href={user.html_url}>
								<div>
								<img src={image} className="user_image" role="presentation"/>
								<p className="user_name">{name}</p>
								<p>Location: {location}</p>
								<p>Followers: {followers}</p>						
								</div>
							</a>
						</div>
					</div>
				);				
			}
		}
		
		return userGrid;
	}

	render() {
		let activeSortBy = this.state.sortBy;

		return (
			<div className="App">
				<div className="App-header">
					{/*<img src={logo} className="App-logo" alt="logo" />*/}
				</div>
				<div className="row">
					<div className="column grid_12 left_align">
						<form>
							<input type="text" placeholder="github login" className="input_name" onChange={this._onChangeName.bind(this)}/>
							<button type="button" className="btn add_button" onClick={this._addUser.bind(this)}>Add</button>
						</form>
					</div>
					<div className="column grid_12 hr_line"></div>
				</div>
				<div className="row">
					<div className="column grid_12">
						<ul className="sort_by">
							<li>Sort By: </li>
							<li className={(activeSortBy === 'NAME' ? 'active' : '')} onClick={this._changeSortBy.bind(this, "NAME")}>Name</li>
							<li className={(activeSortBy === 'LOCATION' ? 'active' : '')} onClick={this._changeSortBy.bind(this, "LOCATION")}>Location</li>
							<li className={(activeSortBy === 'FOLLOWER' ? 'active' : '')} onClick={this._changeSortBy.bind(this, "FOLLOWER")}>Followers</li>
						</ul>
					</div>
				</div>
				<div className="row">
					{this._singleUserGrid()}
				</div>
			</div>
		);
	}
}

export default App;
