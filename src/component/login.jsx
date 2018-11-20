import React, { Component } from 'react';
import {
  Grid,
  Segment,
  Divider,
  Input,
  Button,
  Image
} from 'semantic-ui-react';

class Login extends Component {
  state = {
    imageUrl: 'https://picsum.photos/160'
  };

  render() {
    return (
      <Grid style={{ height: '100vh' }}>
        <Grid.Row style={{ height: '15%' }} />
        <Grid.Row style={{ height: '70%' }} centered column={3}>
          <Grid.Column />
          <Grid.Column width={8}>
            <Segment clearing padded="very">
              <Grid column centered>
                <Button circular size="mini" icon="arrow left" />
                <Image src={this.state.imageUrl} circular />
                <Button circular size="mini" icon="arrow right" />
              </Grid>
              <h3>Your Name</h3>
              <Input fluid placeholder="Guest" />
              <h3>Join Room</h3>
              <Input fluid action="Submit" placeholder="00 00 00" />
              <Divider horizontal>Or</Divider>
              <Button fluid content="Create Room" secondary />
            </Segment>
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
        <Grid.Row style={{ height: '15%' }} />
      </Grid>
    );
  }
}

export default Login;
