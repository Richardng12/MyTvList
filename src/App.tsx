import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import Login from './Login'


class App extends React.Component {
  public getResponse = (response: any) => {    
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

  public render() {
    return (
      <div className="App">
     <Login Callback={this.getResponse}/>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
