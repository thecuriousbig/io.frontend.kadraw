import React, { Component } from 'react'
import UserList from './userlist.jsx'
import firebase from '../../config/firebase'
import Chat from '../chat'
import { Grid, Segment, Divider, Input, Button, Image, Header, Modal, Dropdown, Message } from 'semantic-ui-react'

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: {
        users: [],
        setting: {
          numberOfPlayer: 2,
          numberOfRound: 1,
          timer: 60
        }
      },
      isAllUserReady: false
    };
    this.db = firebase.firestore();
    this.lobbyRef = this.db.collection("Lobby");
    this.lobbyId = null;
    this.playRoomRef = this.db.collection("PlayRoom");
  }

  async getRoomInfo(lobbyId) {
    const getDoc = await this.lobbyRef.doc(lobbyId)
      .onSnapshot(function (snapshot) {
        if (!snapshot.exists) {
          console.log("No such document!");
        } else {
          const roomData = snapshot.data();
          this.lobbyId = lobbyId;
          const isAllUserReady = roomData.users.reduce((accReady, currentUser) => accReady && currentUser.ready);

          this.setState({ room: roomData, isAllUserReady });
        }
      }.bind(this), function (error) {
        console.log("Error getting room", error);
      })
  }
  async startGame(lobbyId) {
    if (this.state.room.users.length > 0) {
      if (this.state.isAllUserReady) {
        const userGameData = this.state.room.users.map(user => {
          return {
            id: user.id,
            role: user.role,
            //leader always start as drawer for now
            //for the sake of development speed
            gameRole: user.role === 'Leader' ? 'drawer' : 'guesser'
          }
        })
        const user_score_map = this.state.room.users.map(user => {
          return {
            [user.id]: { score: 0 }
          }
        })
        await this.playRoomRef
          .doc(lobbyId)
          .set({
            currentRound: 1,
            setting: this.state.room.setting,
            user_score_map,
            users: userGameData,
            vocab: {
              word: '',
              hint: ''
            }
          })
          .then(() => {
            console.log(`create play room success`)
          })
          .catch(err => console.log('err ', err))
      }
    }
  }
  async onReady(userId) {
    if (userId) {
      const usersData = await this.lobbyRef
        .doc(this.lobbyId)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log("No such document!");
          } else {
            return doc.data().users;
          }
        })
      await this.lobbyRef
        .doc(this.lobbyId)
        .update({
          users: usersData.map(user => {
            if (user.id === userId) {
              return { ...user, ready: !user.ready }
            }
            return user;
          })
        })
    }
  }
  componentDidMount() {
    this.getRoomInfo(this.props.match.params.lobbyId);
  }
  componentWillUnmount() {
    const unsubscirbe = this.lobbyRef.onSnapshot(function () { });
    unsubscirbe();
  }
  render() {
    const users = this.state.room.users
    const setting = this.state.room.setting
    const { numberOfPlayer, numberOfRound, timer } = setting
    const isAllUsersReadyString = this.state.isAllUserReady ? 'Yes' : 'No';
    return (
      <div>
        <Grid
          textAlign="center"
          style={{
            height: '100vh',
            width: '100%',
            margin: '0px',
            backgroundImage:
              'url(https://firebasestorage.googleapis.com/v0/b/io-frontend-kadraw-c5925.appspot.com/o/bg%2FBG.png?alt=media&token=61985a43-6c24-4d1e-9fe5-5fe8a168e51b)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
          verticalAlign="middle"
          columns={2}
        >
          <style>{`
					body > div,
					body > div > div,
					body > div > div > div.login-form {
						height: 100%;
					}
				`}</style>
          <Grid.Row columns="equal" style={{ maxWidth: '60%', padding: '0px' }}>
            <Grid.Column width={7} style={{ height: '75%', padding: '14px' }}>
              <Segment style={{ height: '100%' }}>
                <h1 style={{ color: '#3a6bff' }}>Player</h1>

                <UserList users={users} handleReady={this.onReady.bind(this)} />
              </Segment>
            </Grid.Column>
            <Grid.Column style={{ height: '75%', padding: '14px' }}>
              <Segment style={{ height: '15%' }}>
                <h3>Room ID : {this.lobbyId}</h3>
              </Segment>
              <Segment style={{ height: '35%' }}>
                Player : {users.length} / {numberOfPlayer}
                <br />
                Round : {numberOfRound}
                <br />
                Timer : {timer}
                <br />
                All is ready : {isAllUsersReadyString}
              </Segment>
              <Segment style={{ height: '45%' }}>
                <h1 style={{ color: '#3a6bff' }}>Chat</h1>
                <button disabled={!this.state.isAllUserReady} onClick={this.startGame.bind(this, this.lobbyId)}>Start game</button>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default Lobby
