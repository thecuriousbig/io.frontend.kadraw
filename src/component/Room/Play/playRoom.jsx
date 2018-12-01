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
        user_score_map: {},
        isUserAnswer: {},
        vocab: {
          word: '',
          hint: ''
        }
      },
      drawer: null,
      guesser: []
    };
    this.db = firebase.firestore();
    this.playRoomRef = this.db.collection('PlayRoom');
    this.playRoomId = null;
    this.intervalHandle = null;
  }
  tick = async () => {
    if (this.state.playRoom.currentTimer === 0) {
      this.nextRound();
      clearInterval(this.intervalHandle)
    } else if (this.state.playRoom.currentTimer > 0) {
      await this.playRoomRef
        .doc(this.playRoomId)
        .update({ currentTimer: this.state.playRoom.currentTimer-- })
    }
  }
  startCountDown = () => {
    this.intervalHandle = setInterval(this.tick, 1000);
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
      if (this.state.user.gameRole === 'Drawer') {
        if (this.state.playRoom.currentTimer !== this.state.playRoom.setting.timer) {
          this.startCountDown();
        }
      }
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
  nextRound = async () => {
    const nextRound = this.state.playRoom.currentRound + 1;
    if (nextRound < this.state.playRoom.setting.numberOfRound) {
      const user_score_map = this.state.playRoom.users.reduce((obj, user) => Object.assign(obj, { [user.id]: this.state.playRoom.user_score_map[user.id] }), {})
      const is_user_answer_map = this.state.playRoom.users.reduce((obj, user) => Object.assign(obj, { [user.id]: false }), {})
      await this.playRoomRef
        .doc(this.playRoomId)
        .set({
          currentRound: nextRound,
          setting: this.state.playRoom.setting,
          user_score_map,
          users: this.state.playRoom.users,
          vocab: {
            word: '',
            hint: ''
          },
          painting: {
            drawer: {},
            canvas: []
          },
          currentTimer: this.state.playRoom.setting.timer,
          isUserAnswer: is_user_answer_map
        })
    }
  }
  // handleAllCorrect = async ()
  render() {
    const users = this.state.playRoom.users;
    const setting = this.state.playRoom.setting;
    const { numberOfPlayer, numberOfRound } = setting;
    const timer = this.state.playRoom.currentTimer;
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
              playRoomId={this.playRoomId}
              vocab={this.state.playRoom.vocab}
              userId={this.state.user.id}
              isAnswer={this.state.playRoom.isUserAnswer[this.state.user.id]}
              drawer={this.state.drawer}
              onCanvasChange={this.handleCanvasChange.bind(this)}
              newCanvas={this.state.playRoom.painting.canvas}
              handleAllCorrect={this.nextRound}
              handleSelectWord={this.startCountDown}
            />
          </Grid.Column>
        </Grid>
        <Segment style={{ minHeight: '572px', maxHeight: '572px' }}>
          Round : {this.state.playRoom.currentRound} / {numberOfRound}
          Timer : {timer}
          <UserList userId={this.state.user.id} users={this.state.playRoom.users} />
        </Segment>
      </div>
    );
  }
}

export default PlayRoom;
