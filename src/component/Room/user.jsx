import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';
class User extends Component {
  constructor(props) {
    super(props);
  }
  renderUserElement() {
    if (this.props.user) {
      return (
        <Comment.Group>
          <Comment style={{ textAlign: 'left' }}>
            <Comment.Avatar src={this.props.user.avatar} />
            <Comment.Content>
              <Comment.Author style={{ color: 'black', fontSize: '18px' }}>
                {this.props.user.name}
              </Comment.Author>
            </Comment.Content>
          </Comment>
        </Comment.Group>
      );
    }
    return;
  }
  render() {
    let user_ele = this.renderUserElement();
    return <div>{user_ele}</div>;
  }
}

export default User;
