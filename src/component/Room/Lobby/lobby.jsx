import React, { Component } from 'react';
import UserList from './userlist';
import firebase from '../../../config/firebase';
import Chat from '../../chat';
import {
  Grid,
  Segment,
  Input,
  Button,
  Image,
  Dropdown
} from 'semantic-ui-react';

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
    this.lobbyRef = this.db.collection('Lobby');
    this.lobbyId = this.props.match.params.lobbyId;
    console.log(this.lobbyId);
    this.playRoomRef = this.db.collection('PlayRoom');
  }

  async getRoomInfo(lobbyId) {
    await this.lobbyRef.doc(lobbyId).onSnapshot(
      function(snapshot) {
        if (!snapshot.exists) {
          console.log('No such document!');
        } else {
          const roomData = snapshot.data();
          this.lobbyId = lobbyId;
          const isAllUserReady = roomData.users.reduce(
            (accReady, currentUser) => accReady && currentUser.ready
          );

          this.setState({ room: roomData, isAllUserReady });
        }
      }.bind(this),
      function(error) {
        console.log('Error getting room', error);
      }
    );
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
          };
        });
        const user_score_map = this.state.room.users.reduce(
          (obj, user) => Object.assign(obj, { [user.id]: 0 }),
          {}
        );
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
            },
            painting: {
              drawer: {},
              canvas: []
            }
          })
          .then(() => {
            console.log(`create play room success`);
          })
          .catch(err => console.log('err ', err));
      }
    }
  }
  onReady = async userId => {
    if (userId) {
      const usersData = await this.lobbyRef
        .doc(this.lobbyId)
        .get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such document!');
          } else {
            return doc.data().users;
          }
        });
      await this.lobbyRef.doc(this.lobbyId).update({
        users: usersData.map(user => {
          if (user.id === userId) {
            return { ...user, ready: !user.ready };
          }
          return user;
        })
      });
    }
  };
  componentDidMount() {
    this.getRoomInfo(this.props.match.params.lobbyId);
  }
  componentWillUnmount() {
    const unsubscribe = this.lobbyRef.onSnapshot(function() {});
    unsubscribe();
  }

  handleChange = (event, data) => {
    if (event.target.name === 'roundSetting') {
      console.log('event;');
      this.setState({ room: { setting: { numberOfRound: data.value } } });
    } else if (event.target.name === 'timerSetting') {
      console.log('time : ', data.value);
      this.setState({ room: { setting: { timer: data.value } } });
    } else {
    }
  };

  renderStartButton = () => {
    return (
      <Button
        size="big"
        fluid
        content="Start Game"
        style={{ backgroundColor: '#3a6bff', color: 'white' }}
      />
    );
  };

  renderReadyButton = () => {
    return (
      <Button
        size="big"
        fluid
        content="Ready"
        style={{ backgroundColor: '#3a6bff', color: 'white' }}
      />
    );
  };

  render() {
    const users = this.state.room.users;
    const chatProps = {
      author: this.props.location.state.username,
      avatar: this.props.location.state.avatar
    };
    const setting = this.state.room.setting;
    const { numberOfPlayer, numberOfRound } = setting;
    const isAllUsersReadyString = this.state.isAllUserReady ? 'Yes' : 'No';
    const roundOptions = [
      { key: 1, text: '1', value: 1 },
      { key: 2, text: '2', value: 2 },
      { key: 3, text: '3', value: 3 },
      { key: 4, text: '4', value: 4 },
      { key: 5, text: '5', value: 5 },
      { key: 6, text: '6', value: 6 },
      { key: 7, text: '7', value: 7 },
      { key: 8, text: '8', value: 8 },
      { key: 9, text: '9', value: 9 },
      { key: 10, text: '10', value: 10 }
    ];
    const timerOptions = [
      { key: 1, text: '60', value: 60 },
      { key: 2, text: '90', value: 90 },
      { key: 3, text: '120', value: 120 },
      { key: 4, text: '150', value: 150 }
    ];
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
          <Grid.Row stretched style={{ height: '120px', padding: '24px' }}>
            <Image
              wrapped
              style={{ textAlign: 'center' }}
              size="large"
              src="https://firebasestorage.googleapis.com/v0/b/io-frontend-kadraw-c5925.appspot.com/o/logo%2Flogo_kadraw.png?alt=media&token=2e9cdbd0-f64a-4a06-b94a-67b0553b71f0"
            />
          </Grid.Row>

          <Grid.Row stretched columns="equal" style={{ padding: '0px' }}>
            <Grid.Column
              width={4}
              style={{
                height: '100%',
                padding: '14px'
              }}
            >
              <Segment style={{}}>
                <Grid style={{ padding: '8px 16px 8px 16px' }}>
                  <Grid.Row textAlign="center" style={{ padding: '0px' }}>
                    <h1
                      style={{
                        color: '#3a6bff',
                        width: '100%',
                        padding: '0px'
                      }}
                    >
                      Player ({users.length} / {numberOfPlayer})
                    </h1>
                  </Grid.Row>
                  <Grid.Row
                    style={{
                      minHeight: '530px',
                      maxHeight: '530px',
                      overflow: 'auto'
                    }}
                  >
                    <Segment
                      style={{
                        width: '100%',
                        height: '100%',
                        padding: '0px'
                      }}
                    >
                      <UserList users={users} handleReady={this.onReady} />
                    </Segment>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid
                      textAlign="center"
                      verticalAlign="middle"
                      columns={2}
                      style={{ padding: '0px', margin: '0px' }}
                    >
                      <Grid.Column
                        width={8}
                        style={{ padding: '0px 8px 0px 0px' }}
                      >
                        <Button
                          basic
                          color="blue"
                          size="big"
                          fluid
                          content="Leave Game"
                          style={{ backgroundColor: '#3a6bff', color: 'white' }}
                        />
                      </Grid.Column>
                      <Grid.Column
                        width={8}
                        style={{ padding: '0px 0px 0px 8px' }}
                      >
                        <Button
                          size="big"
                          fluid
                          disabled={!this.state.isAllUserReady}
                          content={
                            isAllUsersReadyString === 'Yes'
                              ? 'Start Game'
                              : 'Ready'
                          }
                          style={{ backgroundColor: '#3a6bff', color: 'white' }}
                          onClick={this.startGame.bind(this, this.lobbyId)}
                        />
                      </Grid.Column>
                    </Grid>
                  </Grid.Row>
                </Grid>
              </Segment>
            </Grid.Column>
            <Grid.Column width={5} style={{ height: '100%', padding: '14px' }}>
              <Segment compact>
                <Grid textAlign="center" verticalAlign="middle" columns={2}>
                  <Grid.Column width={4}>
                    <h2 style={{ color: '#3a6bff' }}>Room ID </h2>
                  </Grid.Column>
                  <Grid.Column>
                    <Input
                      fluid
                      type="number"
                      size="big"
                      placeholder="12 34 56"
                      name="lobbyId"
                      value={this.lobbyId}
                      action={{ content: 'Copy' }}
                    />
                  </Grid.Column>
                </Grid>
              </Segment>
              <Segment
                compact
                verticalAlign="middle"
                style={{ padding: '16px 64px' }}
              >
                <h1 style={{ color: '#3a64ff' }}>Settings </h1>
                <Grid columns={2}>
                  <Grid.Column textAlign="left">
                    <h3 style={{ color: '#3a64ff' }}>Rounds </h3>
                    <Dropdown
                      fluid
                      selection
                      options={roundOptions}
                      name="roundSetting"
                      value={this.state.room.setting.numberOfRound}
                      onChange={this.handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column textAlign="left">
                    <h3 style={{ color: '#3a64ff' }}>Timers </h3>
                    <Dropdown
                      fluid
                      selection
                      options={timerOptions}
                      name="timerSetting"
                      value={this.state.room.setting.timer}
                      onChange={this.handleChange}
                    />
                  </Grid.Column>
                </Grid>
              </Segment>
              <Segment
                style={{
                  height: '370px',
                  minHeight: '370px',
                  maxHeight: '370px'
                }}
              >
                <h1 style={{ color: '#3a64ff' }}>Chat</h1>
                <Chat lobbyId={this.lobbyId} user={chatProps} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Lobby;

//  <Grid.Row columns="equal" style={{ maxWidth: '60%', padding: '0px' }}>
//   <Grid.Column width={7} style={{ height: '75%', padding: '14px' }}>
//     <Segment style={{ height: '100%' }}>
//       <h1 style={{ color: '#3a6bff' }}>Player</h1>

//       <UserList users={users} handleReady={this.onReady.bind(this)} />
//     </Segment>
//   </Grid.Column>
//   <Grid.Column style={{ height: '75%', padding: '14px' }}>
//     <Segment style={{ height: '15%' }}>
//       <h3>Room ID : {this.lobbyId}</h3>
//     </Segment>
//     <Segment style={{ height: '35%' }}>
//       Player : {users.length} / {numberOfPlayer}
//       <br />
//       Round : {numberOfRound}
//       <br />
//       Timer : {timer}
//       <br />
//       All is ready : {isAllUsersReadyString}
//     </Segment>
//     <Segment style={{ height: '45%' }}>
//       <h1 style={{ color: '#3a6bff' }}>Chat</h1>
//       <button disabled={!this.state.isAllUserReady} onClick={this.startGame.bind(this, this.lobbyId)}>Start game</button>
