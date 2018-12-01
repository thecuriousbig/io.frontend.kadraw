import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Home from './component/home'
import Lobby from './component/Room/Lobby/lobby'
import PlayRoom from './component/Room/Play/playRoom'
import WordSelector from './component/wordselector'
class App extends Component {
	render() {
		return (
			<div className="App">
				<Route exact path="/" component={Home} />
				<Route exact path="/lobby/:lobbyId" component={Lobby} />
				<Route exact path="/play/:playRoomId" component={PlayRoom} />
				<Route exact path="/word" component={WordSelector} />
			</div>
		)
	}
}

export default App
