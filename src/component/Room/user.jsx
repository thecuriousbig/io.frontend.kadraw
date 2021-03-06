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
            <Comment.Author as="a" style={{ color: this.props.user.id === this.props.userId ? '#3a64ff' : 'black', fontSize: '18px' }}>
              {this.props.user.name}
              &nbsp;
              {this.props.user.id === this.props.userId ? '(You)' : ''}
            </Comment.Author>
            {
              this.props.user.hasOwnProperty('ready') ?
                <Comment.Metadata>
                  <span style={{ color: '#3a64ff' }}>
                    {this.props.user.role === 'Leader'
                      ? this.props.user.role
                      : readyState}
                  </span>
                </Comment.Metadata>
                :
                null
            }
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
