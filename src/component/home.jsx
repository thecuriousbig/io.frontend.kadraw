import React, { Component } from 'react'
import firebase from '../config/firebase'
import chance from 'chance'
import { withRouter } from 'react-router-dom'

import { Grid, Segment, Divider, Input, Button, Image, Header, Modal, Dropdown } from 'semantic-ui-react'

class Home extends Component {
	constructor(props) {
		super(props)
		this.userRef = firebase.firestore().collection('User')
		this.roomRef = firebase.firestore().collection('Rooms')
		this.state = {
			name: '',
			roomId: '',
			score: 0,
			avatarId: 0,
			modal: false,
			dropdownValue: 5,
			imageUrl: 'https://picsum.photos/160'
		}
	}

	handleChange = (event, data) => {
		if (event.target.name === 'name') {
			this.setState({ name: event.target.value })
		} else if (event.target.name === 'roomId') {
			this.setState({ roomId: event.target.value })
		} else {
			this.setState({ dropdownValue: data.value })
		}
	}

	generatePin = () => {
		// Implement checking pin if I have time
		const pin = chance.Chance().integer({ min: 100000, max: 999999 })
		return pin.toString()
	}

	joinRoom = async () => {
		const user = {
			name: this.state.name,
			roomId: this.state.roomId,
			score: this.state.score,
			avatarId: this.state.avatarId
		}

		await this.userRef
			.add(user)
			.then(doc => {
				console.log('doc :', doc)
			})
			.catch(err => {
				console.log('err : ', err)
			})

		console.log('join room')
	}

	showModal = () => this.setState({ modal: true })

	closeModal = () => this.setState({ modal: false })

	createRoom = async () => {
		const user = {
			name: this.state.name,
			roomId: this.generatePin(),
			score: this.state.score,
			avartarId: this.state.avatarId
		}

		const room = {
			users: [],
			setting: {
				numberOfPlayer: this.state.dropdownValue,
				numberOfRound: 5
			}
		}
		console.log('numberOfPlayer: ', room.setting.numberOfPlayer)

		await this.userRef
			.add(user)
			.then(doc => {
				room.users.push({ id: doc.id, role: 'Leader' })
				console.log(`add user [${doc.id}] complete`)
			})
			.catch(err => console.log('err ', err))

		await this.roomRef
			.doc(user.roomId)
			.set(room)
			.then(roomDoc => {
				console.log(`create room success`)
			})
			.catch(err => console.log('err ', err))

		this.closeModal()
		this.props.history.push(`/lobby/${user.roomId}`)
	}

	render() {
		const options = [
			{ key: 2, text: '2', value: 2 },
			{ key: 3, text: '3', value: 3 },
			{ key: 4, text: '4', value: 4 },
			{ key: 5, text: '5', value: 5 },
			{ key: 6, text: '6', value: 6 },
			{ key: 7, text: '7', value: 7 },
			{ key: 8, text: '8', value: 8 },
			{ key: 9, text: '9', value: 9 },
			{ key: 10, text: '10', value: 10 }
		]
		return (
			<div className="login-form">
				<style>{`
					body > div,
					body > div > div,
					body > div > div > div.login-form {
						height: 100%;
					}
				`}</style>
				<Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
					<Grid.Column style={{ maxWidth: 650 }}>
						<Header as="h1" textAlign="center">
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
							<Input
								fluid
								type="number"
								placeholder="12 34 56"
								name="roomId"
								value={this.state.roomId}
								onChange={this.handleChange}
								action={{ content: 'submit', onClick: this.joinRoom }}
							/>
							<Divider horizontal>Or</Divider>
							<Button fluid content="Create Room" onClick={this.showModal} />
						</Segment>
					</Grid.Column>
				</Grid>

				<Modal
					size="mini"
					dimmer="blurring"
					open={this.state.modal}
					onClose={this.closeModal}
					style={{ height: '30%' }}
				>
					<Modal.Header>Room Setting</Modal.Header>
					<Modal.Content>
						<h4>Number of Player</h4>
						<Dropdown
							placeholder="number of player"
							fluid
							selection
							value={this.state.dropdownValue}
							options={options}
							name="dropdown"
							onChange={this.handleChange}
						/>
					</Modal.Content>
					<Modal.Actions>
						<Button primary icon="checkmark" labelPosition="right" content="Next" onClick={this.createRoom} />
					</Modal.Actions>
				</Modal>
			</div>
		)
	}
}

export default withRouter(Home)

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
