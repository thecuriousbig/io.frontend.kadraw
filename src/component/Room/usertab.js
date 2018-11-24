import React, { Component } from "react";

class UserTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: ["John", "McDonald", "Roger", "Tony"]
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props !== state) {
      if (props.users.length > 0) {
        return {
          users: props.users
        };
        // this.setState({ users: this.props.users });
        // console.log("state", this.state.users);
      }
    }
    return { users: [] };
  }
  render() {
    const user_ele = this.state.users.map(user => (
      <li>
        <strong>{user.role}</strong> : {user.id}
      </li>
    ));
    return (
      <div>
        <ul>{user_ele}</ul>
      </div>
    );
  }
}

export default UserTab;
