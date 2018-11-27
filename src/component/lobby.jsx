import React, { Component } from "react";
import UserList from "./Room/userlist.jsx";
import firebase from "../config/firebase";

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
    const users = this.state.room.users;
    const setting = this.state.room.setting;
    const { numberOfPlayer, numberOfRound, timer } = setting;
    const isAllUsersReadyString = this.state.isAllUserReady ? 'Yes' : 'No';
    return (
      <div>
        <h1>Lobby bitch</h1>
        <h3>ID : {this.lobbyId}</h3>
        Player : {users.length} / {numberOfPlayer}
        <br />
        Round : {numberOfRound}
        Timer : {timer}
        <UserList users={users} handleReady={this.onReady.bind(this)} />
        All is ready : {isAllUsersReadyString} <br />
        <button disabled={!this.state.isAllUserReady} onClick={this.startGame.bind(this, this.lobbyId)}>Start game</button>
      </div>
    );
  }
}

export default Lobby;
