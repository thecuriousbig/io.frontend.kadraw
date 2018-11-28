import React, { Component } from 'react';
import { Comment } from 'semantic-ui-react';
class User extends Component {
  constructor(props) {
    super(props);
  }
  renderUserElement() {
    if (this.props.user) {
      const readyState = this.props.user.ready ? 'ready' : 'not ready';
      return (
        <Comment style={{ textAlign: 'left' }}>
          <Comment.Avatar as="a" src={this.props.user.avatar} />
          <Comment.Content>
            <Comment.Author as="a" style={{ color: 'black', fontSize: '18px' }}>
              {this.props.user.name}
            </Comment.Author>
            <Comment.Metadata>
              <span style={{ color: '#3a64ff' }}>
                {this.props.user.role === 'Leader'
                  ? this.props.user.role
                  : readyState}
              </span>
            </Comment.Metadata>
          </Comment.Content>
        </Comment>
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
