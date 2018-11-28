import React, { Component } from 'react'
import UserList from './userlist.jsx'
import firebase from '../../../config/firebase'
import Game from './game.jsx'
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
                painting: { canvas: [], drawer: null },
                user_score_map: {},

            },
            drawer: null,
            guesser: []
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
                    const guesser = snapshot.data().users.filter(user => {
                        if (user.gameRole === 'drawer') {
                            this.setState({ drawer: user })
                        }
                        return user.gameRole === 'guesser'
                    });
                    this.setState({ playRoom: playRoomData, guesser });
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
    addCanvas(canvas, drawer) {
        this.playRoomRef.doc(this.playRoomId)
            .update({
                painting: {
                    canvas,
                    drawer
                }
            })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.playRoom.user_score_map !== prevState.playRoom.user_score_map && this.state.playRoom.user_score_map) {
            console.log('triggered');

            const usersWithScore = this.state.playRoom.users.map(user => { return { ...user, score: this.state.playRoom.user_score_map[user.id] } })
            this.setState({ playRoom: { ...this.state.playRoom, users: usersWithScore } });
        }
    }
    async handleCanvasChange(canvas) {
        await this.addCanvas(canvas, this.state.drawer);
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
                <hr />
                <Game drawer={this.state.drawer} onCanvasChange={this.handleCanvasChange.bind(this)} newCanvas={this.state.playRoom.painting.canvas} />
            </div>
        )
    }
}

export default PlayRoom
