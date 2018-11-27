import React, { Component } from "react";
import User from '../user'
import firebase from "../../../config/firebase";
class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.props !== prevProps) && this.props.users.length > 0) {
            this.getAllUsersInfo(this.props.users);
        }
    }
    async getAllUsersInfo(users) {
        const usersWithInfo = await Promise.all(
            users.map(async user => {
                const userInfo = await this.getUserInfo(user.id)
                return { ...userInfo, id: user.id, role: user.role, gameRole: user.gameRole };
            })
        )
        this.setState({ users: usersWithInfo });
    }
    getUserInfo(userId) {
        const userRef = firebase.firestore().collection("User");
        var userData = userRef
            .doc(userId)
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    console.log("No such document!");
                } else {
                    const { avatar, lobbyId, name, score } = doc.data()
                    return { avatar, lobbyId, name, score }
                }
            })
            .catch(err => {
                console.log("Error getting document", err);
            });
        return userData;
    }
    renderUserElement() {
        if (this.state.users.length > 0) {
            return this.state.users.map(user => {
                return (
                    <li>
                        <User user={user} />
                        <strong>{user.gameRole}</strong>
                    </li>
                )
            });
        }
        return 'No user'
    }

    render() {
        let users_ele = this.renderUserElement();
        return (
            <div>
                <ul>{users_ele}</ul>
            </div >
        );
    }
}

export default UserList;
