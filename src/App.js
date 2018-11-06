import React, { Component } from 'react'
import firebase from './config/firebase'

import { Button } from 'semantic-ui-react'
class App extends Component {
	render() {
		return (
			<div className="App">
				<Button primary>Click me bitch !</Button>
				<h1>Kadraw.io</h1>
			</div>
		)
	}
}

export default App
