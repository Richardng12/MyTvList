import * as React from 'react';
import './App.css';
import tvlogo from './tvlogo.png';
import Login from './Login'
import 'src/css/styles.css';


interface IState {
	currentShow: any,
	TvList: any[],
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, any, IState> {

  constructor(props: any) {
    super(props);

    this.state = {
      isLoggedin: false,
      ImageUrl: "",
      Author: "",
      TvList: [],
			open: false,
			uploadFileList: null
    };
    this.enableLogin = this.enableLogin.bind(this);
    this.selectNewShow = this.selectNewShow.bind(this)
		this.fetchShows = this.fetchShows.bind(this)
		this.fetchShows("")	
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadShow = this.uploadShow.bind(this)
  }

  enableLogin() {
    this.setState({
      isLoggedin: true
    });
  }


  private fetchShows(tag: any) {
    let url = "https://tvlistapis.azurewebsites.net/api/TvList/"
    if (tag !== "") {
        url += "/tag?=" + tag
    }
    fetch(url, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(json => {
        let currentShow = json[0]
        if (currentShow== undefined) {
            currentShow = {}
        }
        this.setState({
            currentShow,
            memes: json
        })
    });
}

  private selectNewShow(newShow: any) {
		this.setState({
			currentShow: newShow
		})
	}

  private handleFileUpload(fileList: any) {
    this.setState({
        uploadFileList: fileList.target.files
    })
  }


  private uploadShow() {
    const titleInput = document.getElementById("show-title-input") as HTMLInputElement
    const tagInput = document.getElementById("show-tag-input") as HTMLInputElement
    const scoreInput = document.getElementById("show-score-input") as HTMLInputElement
    const imageFile = this.state.uploadFileList[0]
  
    if (titleInput === null || tagInput === null || imageFile === null) {
        return;
    }
  
    const title = titleInput.value
    const tag = tagInput.value
    const score = scoreInput.value
    const url = "https://tvlistapis.azurewebsites.net/api/TvList/upload"
  
    const formData = new FormData()
    formData.append("Title", title)
    formData.append("Tags", tag)
    formData.append("Score", score)
    formData.append("image", imageFile)
  
  
    fetch(url, {
        body: formData,
        headers: {'cache-control': 'no-cache'},
        method: 'POST'
    })
    .then((response : any) => {
        if (!response.ok) {
            // Error State
            alert(response.statusText)
        } else {
            location.reload()
        }
    })
  }


  public getResponse = (response: any) => {
    if (response.error) {
      console.log(response.error)
    } else {

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

      this.setState({
        ImageUrl: profile.getImageUrl(),
        Author: profile.getName()
      })
    
      this.enableLogin();
    }
  }

  public displayPage() {

    if (this.state.isLoggedin) {
      return (<div>
        <div className="image">
              <img style={{ height: '100px', width: '100px' }} src={this.state.ImageUrl} />
            </div>
            <div>
             <h3> {this.state.Author}</h3>
              </div>
        </div>)
    }
    else {
      return (<div>
        <div>
          <div className="header-wrapper">
            <div className="container header">
              <div className="static" style={{ textAlign: 'center' }}>
                <h1><img src={tvlogo} height='200' width='400' /></h1>
                <h2> <Login Callback={this.getResponse} /></h2>
              </div>
            </div>
          </div>
        </div>
      </div>)
    }
  }

  public render() {
    return (
      <div>
        {this.displayPage()}
      </div>
    )
  }
}

export default App;
