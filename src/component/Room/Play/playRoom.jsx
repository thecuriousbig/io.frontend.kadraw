import React, { Component } from 'react';
import UserList from './userlist.jsx';
import firebase from '../../../config/firebase';
import Game from './game.jsx';
import {
  Grid,
  Segment,
  Divider,
  Input,
  Button,
  Image,
  Modal,
  Dropdown,
  Message
} from 'semantic-ui-react';

class PlayRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        gameRole: '',
        id: '',
        role: ''
      },
      playRoom: {
        users: [],
        setting: {
          numberOfPlayer: 2,
          numberOfRound: 1,
          timer: 60
        },
        painting: { canvas: [], drawer: null },
        user_score_map: {}
      },
      drawer: null,
      guesser: []
    };
    this.db = firebase.firestore();
    this.playRoomRef = this.db.collection('PlayRoom');
    this.playRoomId = null;
  }
  async getPlayRoomInfo(playRoomId) {
    const getDoc = await this.playRoomRef.doc(playRoomId).onSnapshot(
      function (snapshot) {
        if (!snapshot.exists) {
          console.log('No such document!');
        } else {
          const playRoomData = snapshot.data();
          this.playRoomId = playRoomId;
          const guesser = snapshot.data().users.filter(user => {
            if (user.gameRole === 'Drawer') {
              this.setState({ drawer: user });
            }
            return user.gameRole === 'Guesser';
          });
          this.setState({ playRoom: playRoomData, guesser });
        }
      }.bind(this),
      function (error) {
        console.log('Error getting room', error);
      }
    );
  }
  componentDidMount() {
    this.getPlayRoomInfo(this.props.match.params.playRoomId);
  }
  componentWillUnmount() {
    const unsubscirbe = this.playRoomRef.onSnapshot(function () { });
    unsubscirbe();
  }
  addCanvas(canvas, drawer) {
    this.playRoomRef.doc(this.playRoomId).update({
      painting: {
        canvas,
        drawer
      }
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const currentUser = this.state.playRoom.users.find(user => user.id === this.props.location.state.user.id);
    if (currentUser && prevState.user && (JSON.stringify(prevState.user) !== JSON.stringify(currentUser))) {
      this.setState({ user: currentUser })
    }
    if (
      this.state.playRoom.user_score_map !==
      prevState.playRoom.user_score_map &&
      this.state.playRoom.user_score_map
    ) {
      const usersWithScore = this.state.playRoom.users.map(user => {
        return { ...user, score: this.state.playRoom.user_score_map[user.id] };
      });
      this.setState({
        playRoom: { ...this.state.playRoom, users: usersWithScore }
      });
    }
  }
  async handleCanvasChange(canvas) {
    await this.addCanvas(canvas, this.state.drawer);
  }
  render() {
    const users = this.state.playRoom.users;
    const setting = this.state.playRoom.setting;
    const { numberOfPlayer, numberOfRound, timer } = setting;
    return (
      <div
        style={{
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            'url(https://firebasestorage.googleapis.com/v0/b/io-frontend-kadraw-c5925.appspot.com/o/bg%2FBG.png?alt=media&token=61985a43-6c24-4d1e-9fe5-5fe8a168e51b)',
          width: '100%',
          height: '100vh'
        }}
      >
        <Grid textAlign="center">
          <Grid.Column width={12}>
            <Game
              isDrawer={this.state.user.gameRole === 'Drawer'}
              drawer={this.state.drawer}
              onCanvasChange={this.handleCanvasChange.bind(this)}
              newCanvas={this.state.playRoom.painting.canvas}
            />
          </Grid.Column>
        </Grid>
        <Segment style={{ minHeight: '572px', maxHeight: '572px' }}>
          Round : {this.state.playRoom.currentRound} / {numberOfRound}
          {/* Timer : {timer} */}
          <UserList userId={this.state.user.id} users={this.state.playRoom.users} />
        </Segment>
      </div>
    );
  }
}

export default PlayRoom;
