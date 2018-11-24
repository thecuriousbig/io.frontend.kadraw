import React, { Component } from 'react'
import firebase from '../config/firebase'
import chance from 'chance'
import { withRouter } from 'react-router-dom'

import { Grid, Segment, Divider, Input, Button, Image, Header, Modal, Dropdown, Message } from 'semantic-ui-react'

class Home extends Component {
	constructor(props) {
		super(props)
		this.userRef = firebase.firestore().collection('User')
		this.lobbyRef = firebase.firestore().collection('Lobby')
		this.avatarRef = firebase.firestore().collection('Asset')

		this.state = {
			name: '',
			lobbyId: '',
			haveError: false,
			error: '',
			score: 0,
			avatarId: 0,
			modal: false,
			dropdownValue: 5,
			avatar: []
		}
	}

	async componentDidMount() {
		await this.avatarRef
			.doc('avatar')
			.get()
			.then(docs => {
				this.setState({ avatar: docs.data().url })
			})
			.catch(err => console.log('err : ', err))

		console.log(this.state.avatar)
	}

	handleChange = (event, data) => {
		if (event.target.name === 'name') {
			this.setState({ name: event.target.value })
		} else if (event.target.name === 'lobbyId') {
			this.setState({ lobbyId: event.target.value })
		} else {
			this.setState({ dropdownValue: data.value })
		}
	}

	getExcludeRandom = excludeArray => {
		let num = 0
		let match = false
		do {
			num = chance.Chance().integer({ min: 100000, max: 999999 })
			excludeArray.forEach(i => {
				if (i === num) {
					match = true
				}
			})
		} while (match)
		return num.toString()
	}

	generatePin = async () => {
		// Implement checking pin if I have time
		let pin = chance
			.Chance()
			.integer({ min: 100000, max: 999999 })
			.toString()
		await this.lobbyRef.get().then(querySnapshot => {
			let excludeArray = []
			let isMatch = false
			querySnapshot.forEach(docs => {
				if (pin === docs.id) {
					isMatch = true
				}
				excludeArray.push(parseInt(docs.id, 10))
			})
			if (isMatch) {
				pin = this.getExcludeRandom(excludeArray)
			}
		})
		return pin
	}

	joinLobby = async () => {
		const user = {
			name: this.state.name,
			lobbyId: this.state.lobbyId.toString(),
			score: this.state.score,
			avatar: this.state.avatar[this.state.avatarId]
		}

		let isExist = true
		let numberOfPlayer, playerInLobby, isFull
		this.setState({ haveError: false })

		await this.lobbyRef
			.doc(user.lobbyId)
			.get()
			.then(
				snapshot => {
					if (snapshot.exists === false) {
						// if document does not exist
						isExist = false
						return this.setState({ haveError: true, error: 'lobby not found' })
					}
					numberOfPlayer = snapshot.data().setting.numberOfPlayer
					playerInLobby = snapshot.data().users.length
					isFull = playerInLobby < numberOfPlayer ? false : true
					if (isFull) {
						this.setState({ haveError: true, error: 'lobby is full' })
					}
				},
				err => {
					console.log('err : ', err)
				}
			)

		if (isExist && !isFull) {
			await this.userRef.add(user).then(
				doc => {
					this.lobbyRef
						.doc(user.lobbyId)
						.update({
							users: firebase.firestore.FieldValue.arrayUnion({ id: doc.id, role: 'Member' })
						})
						.then(() => console.log('add player to lobby complete'), err => console.log('err ', err))
				},
				err => {
					console.log('err ', err)
				}
			)
			this.props.history.push(`/lobby/${user.lobbyId}`)
		}
	}

	showModal = () => this.setState({ modal: true })

	closeModal = () => this.setState({ modal: false })

	createLobby = async () => {
		const user = {
			name: this.state.name,
			lobbyId: await this.generatePin(),
			score: this.state.score,
			avatar: this.state.avatar[this.state.avatarId]
		}

		const lobby = {
			users: [],
			setting: {
				numberOfPlayer: this.state.dropdownValue,
				numberOfRound: 5
			}
		}

		await this.userRef
			.add(user)
			.then(doc => {
				lobby.users.push({ id: doc.id, role: 'Leader' })
				console.log(`add user [${doc.id}] complete`)
			})
			.catch(err => console.log('err ', err))

		await this.lobbyRef
			.doc(user.lobbyId)
			.set(lobby)
			.then(() => {
				console.log(`create lobby success`)
			})
			.catch(err => console.log('err ', err))

		this.closeModal()
		this.props.history.push(`/lobby/${user.lobbyId}`)
	}

	changeAvatar = event => {
		const current = this.state.avatarId
		if (event.target.name === 'left') {
			if (this.state.avatarId === 0) {
				this.setState({ avatarId: 53 })
			} else {
				this.setState({ avatarId: current - 1 })
			}
		} else {
			if (this.state.avatarId === 53) {
				this.setState({ avatarId: 0 })
			} else {
				this.setState({ avatarId: current + 1 })
			}
		}
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

		const { haveError, error } = this.state

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
								<Button circular size="mini" icon="arrow left" name="left" onClick={this.changeAvatar} />
								<Image src={this.state.avatar[this.state.avatarId]} circular style={{ width: '50%', height: '50%' }} bordered />
								<Button circular size="mini" icon="arrow right" name="right" onClick={this.changeAvatar} />
							</Grid>

							<h3 style={{ textAlign: 'left' }}>Your Name</h3>
							<Input fluid placeholder="Guest" name="name" value={this.state.name} onChange={this.handleChange} />
							<h3 style={{ textAlign: 'left' }}>Join Room</h3>
							<Input
								fluid
								type="number"
								placeholder="12 34 56"
								name="lobbyId"
								value={this.state.lobbyId}
								onChange={this.handleChange}
								action={{ content: 'Join', onClick: this.joinLobby }}
							/>
							{haveError ? <Message error header="Action Forbidden" content={error} /> : ''}
							<Divider horizontal>Or</Divider>
							<Button fluid content="Create Lobby" onClick={this.showModal} />
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
					<Modal.Header>Lobby Setting</Modal.Header>
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
						<Button primary icon="checkmark" labelPosition="right" content="Next" onClick={this.createLobby} />
					</Modal.Actions>
				</Modal>
			</div>
		)
	}
}

export default withRouter(Home)
