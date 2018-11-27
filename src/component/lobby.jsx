import React, { Component } from 'react';
import UserTab from './Room/usertab.jsx';
import firebase from '../config/firebase';
import {
  Grid,
  Segment,
  Divider,
  Input,
  Button,
  Image,
  Header,
  Modal,
  Dropdown,
  Message
} from 'semantic-ui-react';

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
    this.lobbyRef = this.db.collection('Lobby');
    this.lobbyId = null;
  }

  async getRoomInfo(lobbyId) {
    const getDoc = await this.lobbyRef.doc(lobbyId).onSnapshot(
      function(snapshot) {
        if (!snapshot.exists) {
          console.log('No such document!');
        } else {
          this.lobbyId = lobbyId;
          this.setState({ room: snapshot.data() });
        }
      }.bind(this),
      function(error) {
        console.log('Error getting room', error);
      }
    );
  }
  componentDidMount() {
    this.getRoomInfo(this.props.match.params.lobbyId);
  }
  componentWillUnmount() {
    const unsubscirbe = this.lobbyRef.onSnapshot(function() {});
    unsubscirbe();
  }
  render() {
    const users = this.state.room.users;
    const setting = this.state.room.setting;
    const { numberOfPlayer, numberOfRound } = setting;
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

                <UserTab users={users} />
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
              </Segment>
              <Segment style={{ height: '45%' }}>
                <h1 style={{ color: '#3a6bff' }}>Chat</h1>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Lobby;
