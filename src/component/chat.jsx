import React, { Component } from 'react'
import firebase from './../config/firebase'

import Message from './message'

import { Grid, Header, Segment, Input, Button } from 'semantic-ui-react'

class Chat extends Component {
	constructor(props) {
		super(props)
		this.state = {
			author: 'biggy',
			message: '',
			list: []
		}
		console.log('chat : ', this.props)
		this.messageRef = firebase
			.database()
			.ref()
			.child(this.props.lobbyId)
	}

	handleChange = event => {
		this.setState({ message: event.target.value })
	}

	handleKeyPress = event => {
		if (event.key !== 'Enter') return
		this.sendMessage()
	}

	sendMessage = event => {
		if (this.state.message) {
			const item = {
				author: this.state.author,
				message: this.state.message
			}
			this.messageRef.push(item)
			this.setState({ message: '' })
		}
	}

	async componentDidMount() {
		await this.messageRef.limitToLast(10).on('value', message => {
			if (message !== null) this.setState({ list: Object.values(message.val()) })
		})
	}

	render() {
		return (
			<Grid style={{ height: '100%' }}>
				<Grid.Column style={{ maxWidth: 650 }}>
					<Header as="h1" textAlign="center">
						Chat
					</Header>
					<Segment>
						{this.state.list.map((message, index) => (
							<Message key={index} message={message} />
						))}
					</Segment>
					<Input
						fluid
						type="text"
						placeholder="type something"
						value={this.state.message}
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
					/>
					<Button content="Create Lobby" onClick={this.sendMessage} />
				</Grid.Column>
			</Grid>
		)
	}
}

export default Chat
