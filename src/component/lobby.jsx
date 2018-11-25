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
    this.db = firebase.firestore();
    this.lobbyRef = this.db.collection("Lobby");
    this.lobbyId = null;

  }

  async getRoomInfo(lobbyId) {
    const getDoc = await this.lobbyRef.doc(lobbyId)
      .onSnapshot(function (snapshot) {
        if (!snapshot.exists) {
          console.log("No such document!");
        } else {
          this.lobbyId = lobbyId;
          this.setState({ room: snapshot.data() });
        }
      }.bind(this), function (error) {
        console.log("Error getting room", error);
      })
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
    const { numberOfPlayer, numberOfRound } = setting;
    return (
      <div>
        <h1>Lobby bitch</h1>
        <h3>ID : {this.lobbyId}</h3>
        Player : {users.length} / {numberOfPlayer}
        <br />
        Round : {numberOfRound}
        <UserTab users={users} />
      </div>
    );
  }
}

export default Lobby;
