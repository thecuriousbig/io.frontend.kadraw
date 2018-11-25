import React, { Component } from "react";
import firebase from "../../config/firebase";
class UserTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if ((this.props.users !== prevProps.users) && this.props.users.length > 0) {
      this.getAllUsersInfo(this.props.users);
    }
  }
  async getAllUsersInfo(users) {
    const usersWithInfo = await Promise.all(
      users.map(async user => {
        const userInfo = await this.getUserInfo(user.id)
        return { ...userInfo, role: user.role };
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
            <strong>{user.role}</strong> : {user.name}
          </li>
        );
      });
    }
    return 'No user'
  }
  render() {
    let user_ele = this.renderUserElement();
    return (
      <div>
        <ul>{user_ele}</ul>
      </div >
    );
  }
}

export default UserTab;
