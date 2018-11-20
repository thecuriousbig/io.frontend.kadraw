import React, { Component } from 'react'
import firebase from './../config/firebase'

import { Form, Grid, Segment, Divider, Input, Button, Image, Header } from 'semantic-ui-react'

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: '',
			roomId: '',
			score: 0,
			avatarId: 0,
			imageUrl: 'https://picsum.photos/160'
		}
	}

	handleChange = event => {
		if (event.target.name === 'name') {
			this.setState({ name: event.target.value })
		} else if (event.target.name === 'roomId') {
			this.setState({ roomId: event.target.value })
		}
	}

	joinRoom = () => {
		console.log('join room')
	}

	createRoom = () => {
		console.log('create room')
	}

	render() {
		return (
			<div className="login-form">
				<style>{`
					body > div,
					body > div > div,
					body > div > div > div.login-form {
						height: 100%;
					}
				`}</style>
				<Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
					<Grid.Column style={{ maxWidth: 650 }}>
						<Header as='h1' textAlign='center'>Kadraw.io</Header>
						<Form size='large'>
							<Segment clearing padded="very">
								<Grid columns={3} centered>
									<Button circular size="mini" icon="arrow left" />
									<Image src={this.state.imageUrl} circular />
									<Button circular size="mini" icon="arrow right" />
								</Grid>
								<h3>Your Name</h3>
								<Input fluid placeholder="Guest" name="name" value={this.state.name} onChange={this.handleChange} />
								<h3>Join Room</h3>
								<Input fluid type="number" placeholder="12 34 56" name="roomId" value={this.state.roomId} onChange={this.handleChange} action={{content: 'submit', onClick: this.joinRoom}}/>
								<Divider horizontal>Or</Divider>
								<Button fluid content="Create Room" onClick={this.createRoom} />
							</Segment>
						</Form>
					</Grid.Column>
    		</Grid>
			</div>
		)
	}
}

export default Login




/* <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
					<Grid.Row centered columns={16} color="green">
						<Grid.Column width={8}>
						<Header textAlign="center" style={{ fontSize: '50px', fontFamily: 'Roboto' }}>
								Kadraw.io
						</Header>
							<Segment clearing padded="very">
								<Grid columns={3} centered>
									<Button circular size="mini" icon="arrow left" />
									<Image src={this.state.imageUrl} circular />
									<Button circular size="mini" icon="arrow right" />
								</Grid>
								<h3>Your Name</h3>
								<Input fluid placeholder="Guest" name="name" value={this.state.name} onChange={this.handleChange} />
								<h3>Join Room</h3>
								<Input fluid type="number" placeholder="12 34 56" name="roomId" value={this.state.roomId} onChange={this.handleChange} action={{content: 'submit', onClick: this.joinRoom}}/>
								<Divider horizontal>Or</Divider>
								<Button fluid content="Create Room" onClick={this.createRoom} />
							</Segment>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row style={{ height: '15%' }} />
				</Grid> */