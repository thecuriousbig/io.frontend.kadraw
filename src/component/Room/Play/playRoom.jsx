import React, { Component } from 'react'
import UserList from './userlist.jsx'
import firebase from '../../../config/firebase'

class PlayRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playRoom: {
                users: [],
                setting: {
                    numberOfPlayer: 2,
                    numberOfRound: 1,
                    timer: 60
                },
                user_score_map: [],

            }
        };
        this.db = firebase.firestore();
        this.playRoomRef = this.db.collection("PlayRoom");
        this.playRoomId = null;
    }
    async getPlayRoomInfo(playRoomId) {
        const getDoc = await this.playRoomRef.doc(playRoomId)
            .onSnapshot(function (snapshot) {
                if (!snapshot.exists) {
                    console.log("No such document!");
                } else {
                    const playRoomData = snapshot.data();
                    this.playRoomId = playRoomId;

                    this.setState({ playRoom: playRoomData });
                }
            }.bind(this), function (error) {
                console.log("Error getting room", error);
            })
    }
    componentDidMount() {
        this.getPlayRoomInfo(this.props.match.params.playRoomId);
    }
    componentWillUnmount() {
        const unsubscirbe = this.playRoomRef.onSnapshot(function () { });
        unsubscirbe();
    }
    render() {
        const users = this.state.playRoom.users
        const setting = this.state.playRoom.setting
        const { numberOfPlayer, numberOfRound, timer } = setting
        return (
            <div>
                Play Room bitch
                <br />
                ID : {this.playRoomId}
                <br />
                Round : {this.state.playRoom.currentRound} / {numberOfRound}
                <br />
                Timer : {timer}
                <UserList users={this.state.playRoom.users} />
            </div>
        )
    }
}

export default PlayRoom
