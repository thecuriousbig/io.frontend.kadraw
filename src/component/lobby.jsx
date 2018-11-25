import React, { Component } from "react";
import UserTab from "./Room/usertab.jsx";
import firebase from "../config/firebase";

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room: {
        users: [],
        setting: {
          numberOfPlayer: 2,
          numberOfRound: 1
        }
      }
    };
  }
  async getRoomInfo(lobbyId) {
    const db = firebase.firestore();
    const lobbyRef = db.collection("Lobby");
    const exampleRoomRef = lobbyRef.doc(lobbyId);
    const getDoc = await exampleRoomRef
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          // const { numberOfPlayer, numberOfRound } = doc.data().setting;
          // const roomInfo = {
          //   users: doc.data().users,
          //   setting: {
          //     numberOfPlayer,
          //     numberOfRound
          //   }
          // };
          this.setState({ room: doc.data() });
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  }
  componentDidMount() {
    this.getRoomInfo(this.props.match.params.lobbyId);
  }
  render() {
    const users = this.state.room.users;
    const setting = this.state.room.setting;
    const { numberOfPlayer, numberOfRound } = setting;

    return (
      <div>
        <h1>Lobby bitch</h1>
        Player : {users.length} / {numberOfPlayer}
        <br />
        Round : {numberOfRound}
        <UserTab users={users} />
      </div>
    );
  }
}

export default Lobby;
