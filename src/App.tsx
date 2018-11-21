import * as React from 'react';
import './App.css';
import tvlogo from './tvlogo.png';
import Login from './Login'


class App extends React.Component {
  public getResponse = (response: any) => {    
    if(response.error){
      console.log(response.error)
    }else{

    
    var profile = response.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = response.getAuthResponse().id_token;
    console.log("ID Token: " + id_token); 
  }
}

  public render() {
    return (
      <div>
			<div className="header-wrapper">
				<div className="container header">
					<img src={tvlogo} height='40'/>&nbsp; MyTvList &nbsp;
					   <Login Callback={this.getResponse}/>
				</div>
			</div>
      </div>
    )
  }
}
   
       
  

export default App;
