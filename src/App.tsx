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


const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
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
  createData(<img src={tvlogo} height='50' width='50' />, 159, 6.0, 24, 4.0, 'Me'),
];

interface IState {
  currentShow: any,
  TvList: any[],
  open: boolean,
  uploadFileList: any,
  isLoggedin: boolean,
  ImageUrl: any,
  Creator: any,
  selection: any,
  id: any,
  clicked: boolean
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
      uploadFileList: null,
      currentShow: "",
      selection: "",
      id: "",
      clicked: false
    });
    this.enableLogin = this.enableLogin.bind(this);
    this.disableLogin = this.disableLogin.bind(this);
    this.selectNewShow = this.selectNewShow.bind(this)
    this.fetchShows = this.fetchShows.bind(this)
    this.fetchShows("")
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.uploadShow = this.uploadShow.bind(this)
  }

  public imageClick = (index: any) => {
    const list = this.state.TvList;
    console.log(list[index].id)
    this.setState({
      id: list[index].id,
      clicked: true
    });

  }

  public makeTable() {
    const list = this.state.TvList;

    rows = [
      createData('Please', 'add', 'a', 'Tv', 'show', '!'),
    ];

    for (let i = 0; i < list.length; i++) {
      const show = list[i];
      rows.push(createData(<h5><img src={show.url} height='100' width='100' onClick={() => this.imageClick(i)} /></h5>, <>{show.title}</>, <>{show.score}</>, <>{show.tags}</>, <>{show.comments}</>, <>{show.author}</>));
    }
    return (
      <Paper className={this.props.classes.root}>
        <Table className={this.props.classes.table}>
          <TableHead>
            <TableRow>
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
                <TableRow className={this.props.classes.row} key={row.id}>
                  <CustomTableCell component="th" scope="row">
                    {row.Image}
                  </CustomTableCell>
                  <CustomTableCell>{row.Title}</CustomTableCell>
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
        Creator: profile.getName()
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

  public displayPage() {

    if (this.state.isLoggedin) {
      const { open } = this.state;

      return (<div>
        <div style={{ display: 'inline-block', textAlign: 'center' }}>
          <h1><img src={tvlogo} height='90' width='200' /></h1>
          <GoogleLogout
            buttonText="LOGOUT"
            onLogoutSuccess={this.logout}
          >
          </GoogleLogout>
          {(this.state.clicked) ?
            <Button variant="contained" color="primary" onClick={this.deleteShow.bind(this, this.state.id)}>Delete </Button>
            : ""}

            {(!this.state.clicked) ?
            <Button variant="contained" color="primary" disabled onClick={this.deleteShow.bind(this, this.state.id)}>Delete </Button>
            : ""}

          <Button variant="contained" color="primary" onClick={this.onOpenModal}>Add Show</Button>
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

        </div>

        <div style={{ display: 'inline-block', paddingLeft: '1250px' }} >
          <h4> <img style={{ height: '50px', width: '50px', borderRadius: '50%' }} src={this.state.ImageUrl} /></h4>
          <h3> {this.state.Creator}</h3>
        </div>
        <div>
          {this.makeTable()}
        </div>
      </div>)
    }
    else {
      return (<div>
        <div>
          <div className="header-wrapper">
            <div className="container header">
              <div className="static" style={{ textAlign: 'center' }}>
                <h1><img src={tvlogo} height='150' width='350' /></h1>
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






export default withRoot(withStyles(styles)(App));;
