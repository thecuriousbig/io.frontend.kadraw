import React, { Component } from "react";
import firebase from "../../config/firebase";
class User extends Component {
    constructor(props) {
        super(props);
    }
    renderUserElement() {
        if (this.props.user) {
            return (
                <div>
                    <img src={this.props.user.avatar} width="100px" /><br />
                    <strong>{this.props.user.role}</strong> : {this.props.user.name}<br />
                </div>
            )
        }
        return;
    }
    render() {
        let user_ele = this.renderUserElement();
        return (
            <div>
                {user_ele}
            </div >
        );
    }
}

export default User;
