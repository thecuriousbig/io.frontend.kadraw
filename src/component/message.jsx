import React, { Component } from 'react'

import { Comment } from 'semantic-ui-react'
class Message extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Comment.Group>
				<Comment style={{ textAlign: 'left' }}>
					<Comment.Avatar src={this.props.message.avatar} />
					<Comment.Content>
						<Comment.Author style={{ color: 'blue' }}>{this.props.message.author}</Comment.Author>
						<Comment.Text>{this.props.message.message}</Comment.Text>
					</Comment.Content>
				</Comment>
			</Comment.Group>
		)
	}
}

export default Message
