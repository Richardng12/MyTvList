import * as React from 'react';
import './App.css';
import tvlogo from './tvlogo.png';
import Login from './Login';
import './css/styles.css';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import withRoot from './WithRoot';
import { Theme, createStyles, Button } from '@material-ui/core';
import { GoogleLogout } from 'react-google-login';
import Modal from 'react-responsive-modal';
import MediaStreamRecorder from 'msr';
import Chatbot from './Chatbot'
import IconButton from '@material-ui/core/IconButton';
import { FacebookShareButton, RedditShareButton, TwitterShareButton } from "react-simple-share";



const styles = (theme: Theme) =>

  createStyles({
    root: {
      height: 500,
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      minWidth: 600,
    },
    row: {
      "&:nth-of-type()": {
        backgroundColor: theme.palette.secondary.dark,
      },
    },
  });



const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 17,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

let id = 0;
function createData(Image: any, Title: any, Score: any, Tags: any, Comments: any, Author: any) {
  id += 1;
  return { id, Image, Title, Score, Tags, Comments, Author };
}

var rows = [
];

interface IState {
  currentShow: any,
  TvList: any[],
  open: boolean,
  openEdit: boolean,
  uploadFileList: any,
  isLoggedin: boolean,
  ImageUrl: any,
  Creator: any,
  selection: any,
  id: any,
  clicked: boolean,
  Authentication: any,
  searchByTag: any,
  index: string,
}

class App extends React.Component<WithStyles<typeof styles>, IState> {

  constructor(props: any) {
    super(props);

    this.state = ({
      isLoggedin: false,
      ImageUrl: "",
      Creator: "",
      TvList: [],
      open: false,
      openEdit: false,
      uploadFileList: null,
      currentShow: { "id": 0, "title": "naruto", "url": "", "tags": "ninja", "score": "1", "width": "0", "height": "0", "comments": "hi", "author": "Richard", "authentication": "876876adsf" },
      selection: "",
      id: "",
      clicked: false,
      Authentication: "",
      searchByTag: "",
      index: "",
    });
    this.enableLogin = this.enableLogin.bind(this);
    this.disableLogin = this.disableLogin.bind(this);

    this.fetchShows = this.fetchShows.bind(this)
    this.fetchShows("")
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.uploadShow = this.uploadShow.bind(this)
    this.searchByTag = this.searchByTag.bind(this)
    this.searchTagByVoice = this.searchTagByVoice.bind(this)
  }

  public imageClick = (index: any) => {
    const list = this.state.TvList;

    this.setState({
      id: list[index].id,
      clicked: true,
      currentShow: list[index],
      index: index,
    });

  }

  public makeTable = () => {
    const list = this.state.TvList;

    rows = [
    ];

    for (let i = 0; i < list.length; i++) {
      const show = list[i];
      rows.push(createData(<h5><img src={show.url} height='100' width='100' onClick={() => this.imageClick(i)} /></h5>, <>{show.title}</>, <>{show.score}</>, <>{show.tags}</>, <>{show.comments}</>, <>{show.author}</>));
    }
    return (
      <Paper className={this.props.classes.root}>
        <Table className={this.props.classes.table}>
          <TableHead>
            <TableRow >
              <CustomTableCell>Image</CustomTableCell>
              <CustomTableCell>Title</CustomTableCell>
              <CustomTableCell numeric>Score</CustomTableCell>
              <CustomTableCell>Tags</CustomTableCell>
              <CustomTableCell>Comments</CustomTableCell>
              <CustomTableCell>Author</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              return (
                <TableRow hover className={this.props.classes.row} selected = {false} key={row.id}>
                  <CustomTableCell component="th" scope="row">
                    {row.Image}
                  </CustomTableCell>
                  <CustomTableCell  >{row.Title}</CustomTableCell>
                  <CustomTableCell numeric>{row.Score}</CustomTableCell>
                  <CustomTableCell>{row.Tags}</CustomTableCell>
                  <CustomTableCell>{row.Comments}</CustomTableCell>
                  <CustomTableCell>{row.Author}</CustomTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  enableLogin() {
    this.setState({
      isLoggedin: true
    });
  }

  disableLogin = () => {
    this.setState({
      isLoggedin: false
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
        if (currentShow == undefined) {
          currentShow = {}
        }
        this.setState({
          currentShow,
          TvList: json
        })
      });
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
    const commentInput = document.getElementById("show-comment-input") as HTMLInputElement
    const imageFile = this.state.uploadFileList[0]

    if (titleInput === null || tagInput === null || imageFile === null) {
      return;
    }

    const title = titleInput.value
    const tag = tagInput.value
    const score = scoreInput.value
    const comment = commentInput.value
    const url = "https://tvlistapis.azurewebsites.net/api/TvList/upload"

    const formData = new FormData()
    formData.append("Title", title)
    formData.append("Tags", tag)
    formData.append("Score", score)
    formData.append("Comments", comment)
    formData.append("Author", this.state.Creator)
    formData.append("Authentication", this.state.Authentication)
    formData.append("image", imageFile)


    fetch(url, {
      body: formData,
      headers: { 'cache-control': 'no-cache' },
      method: 'POST'
    })
      .then((response: any) => {
        if (!response.ok) {
          // Error State
          alert(response.statusText)
        } else {
          this.onCloseModal();
          this.fetchShows("");
          this.forceUpdate();

        }
      })
  }

  public logout = () => {
    this.disableLogin()
  }

  public getResponse = (response: any) => {
    if (response.error) {
      console.log(response.error)
    } else {

      var profile = response.getBasicProfile();
      console.log("ID: " + profile.getId());


      // The ID token you need to pass to your backend:
      var id_token = response.getAuthResponse().id_token;
      console.log("ID Token: " + id_token);



      this.setState({
        ImageUrl: profile.getImageUrl(),
        Creator: profile.getName(),
        Authentication: profile.getId()
      })

      this.enableLogin();
    }
  }

  // Modal open
  private onOpenModal = () => {
    this.setState({ open: true });
  };

  // Modal close
  private onCloseModal = () => {
    this.setState({ open: false });
  };


  private onOpenModalEdit = () => {
    console.log(this.state.currentShow)
    this.setState({ openEdit: true });
  };

  // Modal close
  private onCloseModalEdit = () => {
    this.setState({ openEdit: false });
  };

  private deleteShow(id: any) {
    const url = "https://tvlistapis.azurewebsites.net/api/TvList/" + id

    fetch(url, {
      method: 'DELETE'
    })
      .then((response: any) => {
        if (!response.ok) {
          // Error Response
          alert(response.statusText)
        }
        else {
          this.onCloseModal();
          this.fetchShows("");
          this.forceUpdate();
        }
      })
  }

  private updateShow = () => {
    const titleInput = document.getElementById("show-edit-title-input") as HTMLInputElement
    const tagInput = document.getElementById("show-edit-tag-input") as HTMLInputElement
    const scoreInput = document.getElementById("show-edit-score-input") as HTMLInputElement
    const commentInput = document.getElementById("show-edit-comment-input") as HTMLInputElement

    if (titleInput === null || tagInput === null) {
      return;
    }
    const currentShow = this.state.currentShow
    const url = "https://tvlistapis.azurewebsites.net/api/TvList/" + currentShow.id
    const updatedTitle = titleInput.value
    const updatedTag = tagInput.value
    const updatedScore = scoreInput.value
    const updatedComment = commentInput.value
    fetch(url, {
      body: JSON.stringify({
        "height": currentShow.height,
        "id": currentShow.id,
        "tags": updatedTag,
        "title": updatedTitle,
        "url": currentShow.url,
        "width": currentShow.width,
        "score": updatedScore,
        "comments": updatedComment,
        "author": currentShow.author,
        "authentication": currentShow.authentication
      }),
      headers: { 'cache-control': 'no-cache', 'Content-Type': 'application/json' },
      method: 'PUT'
    })
      .then((response: any) => {
        if (!response.ok) {
          // Error State
          alert(response.statusText + " " + url)
        } else {
          this.onCloseModalEdit();
          this.fetchShows("");
          this.forceUpdate();
        }
      })
  }

  private searchByTag() {
    const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
    if (textBox === null) {
      return;
    }
    const tag = textBox.value
    this.fetchShows(tag)
  }

  private searchTagByVoice() {
    const mediaConstraints = {
      audio: true
    }
    const onMediaSuccess = (stream: any) => {
      const mediaRecorder = new MediaStreamRecorder(stream);
      mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
      mediaRecorder.ondataavailable = (blob: any) => {
        this.postAudio(blob);
        mediaRecorder.stop()
      }
      mediaRecorder.start(3000);
    }

    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)

    function onMediaError(e: any) {
      console.error('media error', e);
    }
  }
  private postAudio(blob: any) {
    let accessToken: any;
    fetch('https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
      headers: {
        'Content-Length': '0',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Ocp-Apim-Subscription-Key': '3f31ffdbc4f04808ac72d3ef1aac42a2'
      },
      method: 'POST'
    }).then((response) => {
      // console.log(response.text())
      return response.text()
    }).then((response) => {
      console.log(response)
      accessToken = response
    }).catch((error) => {
      console.log("Error", error)
    });
    // posting audio
    fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US', {
      body: blob, // this is a .wav audio file    
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer' + accessToken,
        'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
        'Ocp-Apim-Subscription-Key': '3f31ffdbc4f04808ac72d3ef1aac42a2'
      },
      method: 'POST'
    }).then((res) => {
      return res.json()
    }).then((res: any) => {
      console.log(res)
      const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
      textBox.value = (res.DisplayText as string).slice(0, -1)
      this.searchByTag();
    }).catch((error) => {
      console.log("Error", error)
    });
  }




  public displayPage() {
    if (this.state.isLoggedin) {
      const { open } = this.state;
      const verify = this.state.Authentication == this.state.currentShow.authentication
      return (<div>
        <div style={{ textAlign: 'center', }}>
          <h1><img src={tvlogo} height='90' width='200' /></h1>
          <div>
            <Chatbot name={this.state.Creator} />
            <GoogleLogout
              buttonText="LOGOUT"
              onLogoutSuccess={this.logout}
            >
            </GoogleLogout>
          </div>
          {(this.state.clicked && verify) ?
            <Button className="delete" variant="contained" style={{ marginTop: '10px' }} color="primary" onClick={this.deleteShow.bind(this, this.state.id)}>Delete </Button>
            : ""}

          {(!this.state.clicked || !verify) ?
            <Button className="delete" variant="contained" style={{ marginTop: '10px' }} color="primary" disabled onClick={this.deleteShow.bind(this, this.state.id)}>Delete </Button>
            : ""}

          <Button variant="contained" style={{ marginLeft: '50px', marginTop: '10px' }} color="primary" onClick={this.onOpenModal}>Add Show</Button>
          <Modal open={open} onClose={this.onCloseModal}>
            <form>
              <div className="form-group">
                <label>Tv Show Title</label>
                <input type="text" className="form-control" id="show-title-input" placeholder="Enter Title" />
                <small className="form-text text-muted">You can edit any show later</small>
              </div>
              <div className="form-group">
                <label>Score</label>
                <input type="number" min="0" max="10" className="form-control" id="show-score-input" placeholder="Enter Score" />
                <small className="form-text text-muted">Out of 10</small>
              </div>
              <div className="form-group">
                <label>Tag</label>
                <input type="text" className="form-control" id="show-tag-input" placeholder="Enter Tag" />
                <small className="form-text text-muted">Tag is used for search</small>
              </div>
              <div className="form-group">
                <label>Comments</label>
                <input type="text" className="form-control" id="show-comment-input" placeholder="Enter Comments" />
                <small className="form-text text-muted">Comments about the show</small>
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" onChange={this.handleFileUpload} className="form-control-file" id="show-image-input" />
              </div>
              <button type="button" className="btn" onClick={this.uploadShow}>Upload</button>
            </form>
          </Modal>

          {(this.state.clicked && verify) ?
            <Button variant="contained" color="primary" style={{ marginLeft: '50px', marginTop: '10px' }} onClick={this.onOpenModalEdit}>Edit </Button>
            : ""}

          {(!this.state.clicked || !verify) ?
            <Button variant="contained" color="primary" style={{ marginLeft: '50px', marginTop: '10px' }} disabled onClick={this.onOpenModalEdit}>Edit </Button>
            : ""}
          <Modal open={this.state.openEdit} onClose={this.onCloseModalEdit}>
              
            <form>
              <div className="form-group">
                <label>Tv Show Title</label>
                <input type="text" className="form-control" id="show-edit-title-input" placeholder="Enter Title" value={this.state.currentShow.title}  />
                <small className="form-text text-muted">You can edit any show later</small>
              </div>
              <div className="form-group">
                <label>Tag</label>
                <input type="text" className="form-control" id="show-edit-tag-input" placeholder="Enter Tag"  />
                <small className="form-text text-muted">Tag is used for search</small>
              </div>
              <div className="form-group">
                <label>Score</label>
                <input type="number" min="0" max="10" className="form-control" id="show-edit-score-input" placeholder="Enter Score" />
                <small className="form-text text-muted">Out of 10</small>
              </div>
              <div className="form-group">
                <label>Comments</label>
                <input type="text" className="form-control" id="show-edit-comment-input" placeholder="Enter Comments"/>
                <small className="form-text text-muted">Comments about the show</small>
              </div>
              <button type="button" className="btn" onClick={this.updateShow}>Save</button>
            </form>
          </Modal>
        </div>

        <div style={{ position: 'absolute', right: '0', top: '0' }}>
          <h4> <img style={{ height: '50px', width: '50px', borderRadius: '50%', marginRight:'45px' }} src={this.state.ImageUrl} /></h4>
          <div style={{marginRight:'25px'}}>
          <FacebookShareButton url="http://mytvlistwebapp.azurewebsites.net/" />
          <RedditShareButton url="http://mytvlistwebapp.azurewebsites.net/" />
          <TwitterShareButton url="http://mytvlistwebapp.azurewebsites.net/" />
            </div>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center'  }}>
          <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search By Tags" />
          <Button variant="contained" color="primary" style={{ marginTop: '10px', marginLeft: '38px' }} className="btn btn-outline-secondary search-button" onClick={this.searchByTag}>Search</Button>
          <IconButton className="btn" style={{ marginTop: '12px', marginLeft: '5px' }} onClick={this.searchTagByVoice}><i className="fa fa-microphone" /></IconButton>
        </div>
        <div>
          {this.makeTable()}
        </div>
      </div>)
    }
    else {
      return (<div style={{backgroundColor:'aliceblue'}}>
          <div className="header-wrapper"  >
            <div className="container header">
              <div className="static" style={{ textAlign: 'center' }}>
                <h1><img src={tvlogo} height='150' width='350' /></h1>
                <h2> <Login Callback={this.getResponse} /></h2>
              </div>
            </div>
          </div>
        </div>
      )
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






export default withRoot(withStyles(styles)(App));;
