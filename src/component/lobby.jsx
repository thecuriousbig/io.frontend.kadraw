import React, { Component } from 'react'
import Chat from './chat'
class Lobby extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return <Chat lobbyId={this.props.match.params.lobbyId} />
	}
}
export default Lobby
