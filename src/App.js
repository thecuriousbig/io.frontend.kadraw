import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import Home from './component/home'
import Lobby from './component/lobby'
class App extends Component {
	render() {
		return (
			<div className="App">
				<Route exact path="/" component={Home} />
				<Route path="/lobby" component={Lobby} />
			</div>
		)
	}
}

export default App
