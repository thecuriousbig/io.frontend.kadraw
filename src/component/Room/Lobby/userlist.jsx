import React, { Component } from 'react';
import User from '../user';
import firebase from '../../../config/firebase';
import '../../kadraw.css';
import { Button, Comment, Grid } from 'semantic-ui-react';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.lobbyRef = firebase.firestore().collection('Lobby');
    this.state = {
      users: []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps && this.props.users.length > 0) {
      this.getAllUsersInfo(this.props.users);
    }
  }
  async getAllUsersInfo(users) {
    const usersWithInfo = await Promise.all(
      users.map(async user => {
        const userInfo = await this.getUserInfo(user.id);
        return { ...userInfo, id: user.id, role: user.role, ready: user.ready };
      })
    );
    this.setState({ users: usersWithInfo });
  }
  getUserInfo(userId) {
    const userRef = firebase.firestore().collection('User');
    var userData = userRef
      .doc(userId)
      .get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          const { avatar, lobbyId, name, score } = doc.data();
          return { avatar, lobbyId, name, score };
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
    return userData;
  }
  handleClickReady(userId) {
    this.props.handleReady(userId);
  }
  renderUserElement() {
    if (this.state.users.length > 0) {
      return this.state.users.map((user, index) => {
        const readyState = user.ready ? 'ready' : 'not ready';
        const readyButton = (
          <Button onClick={this.handleClickReady.bind(this, user.id)}>
            {user.ready ? 'Unready' : 'Ready'}
          </Button>
        );
        return (
          <Comment.Group size="Small">
            <Grid columns={2}>
              <Grid.Column width={10}>
                <User user={user} key={index} />
              </Grid.Column>
              <Grid.Column textAlign="right" width={6}>
                {user.role === 'Leader' ? null : readyButton}
              </Grid.Column>
            </Grid>
          </Comment.Group>
        );
      });
    }
    return 'No user';
  }

  render() {
    let users_ele = this.renderUserElement();
    return (
      <div>
        <ul>{users_ele}</ul>
      </div>
    );
  }
}

export default UserList;
