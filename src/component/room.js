import React, { Component } from "react";
import UserTab from "./Room/usertab.js";
import firebase from "./firebase/firebase";

class Room extends Component {
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
  async getRoomInfo(roomId) {
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    const userRef = db.collection("Lobby");
    const exampleRoomRef = userRef.doc(roomId);
    const getDoc = await exampleRoomRef
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log("No such document!");
        } else {
          console.log("Document data:");
          console.log(doc.data());
          const { numberOfPlayer, numberOfRound } = doc.data().setting;
          const roomInfo = {
            users: doc.data().users,
            setting: {
              numberOfPlayer,
              numberOfRound
            }
          };
          this.setState({ room: doc.data() });
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
      });
  }
  componentDidMount() {
    this.getRoomInfo(this.props.match.params.roomId);
  }
  render() {
    const users = this.state.room.users;
    const setting = this.state.room.setting;
    const { numberOfPlayer, numberOfRound } = setting;

    return (
      <div>
        <h1>Room bitch</h1>
        <UserTab users={users} />
        Player : {users.length} / {numberOfPlayer}
        Round : {numberOfRound}
      </div>
    );
  }
}

export default Room;
