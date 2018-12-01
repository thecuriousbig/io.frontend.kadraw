import React, { Component } from 'react';
import firebase from '../../../../config/firebase'
import Message from '../../../message'

import { Grid, Segment, Input } from 'semantic-ui-react';

class AnswerBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: ''
        }
        this.playRoomRef = firebase.firestore().collection('PlayRoom');
    }
    handleChange = event => {
        this.setState({ answer: event.target.value });
    }
    handleKeyPress = event => {
        if (event.key !== 'Enter') return
        this.submitAnswer()
    }
    submitAnswer = async () => {
        const currentPlayRoomRef = this.playRoomRef
            .doc(this.props.playRoomId);
        if (this.state.answer && this.props.playRoomId && this.props.userId) {
            const rightAnswer = await currentPlayRoomRef
                .get()
                .then(doc => {
                    if (doc.exists) {
                        return doc.data().vocab.word;
                    } else {
                        console.log('No Doc');
                    }
                })
                .catch(error => {
                    console.log('error get answer');
                })
            if (rightAnswer.toLowerCase() === this.state.answer.toLowerCase()) {
                await currentPlayRoomRef
                    .update({
                        ['isUserAnswer.' + this.props.userId]: true
                    })
                alert('Correct!')
                const allAnsweredUser = await currentPlayRoomRef
                    .get()
                    .then(doc => {
                        const drawer = doc.data().users.find(user => user.gameRole === 'Drawer');
                        if (doc.exists && drawer) {
                            return Object.keys(doc.data().isUserAnswer)
                                .filter(userId => userId !== drawer.id)
                                .reduce((prevUserAnswer, userId) => prevUserAnswer && doc.data().isUserAnswer[userId], true)
                        } else {
                            console.log('No Doc');
                        }
                    })
                console.log('allAnswer?', allAnsweredUser);
                if (allAnsweredUser) {
                    this.props.onAllCorrect();
                    alert('Round End: All players guess correct!')
                }
                this.setState({ answer: '' });
            } else {
                alert('Wrong!')
            }
        }
    }
    render() {
        return (
            <Grid>
                <Grid.Column style={{ minWidth: '100%', maxWidth: '100%' }}>
                    {/* <Segment style={{ minHeight: '230px', maxHeight: '230px', overflow: 'auto' }}>
                        <Message />
                    </Segment> */}
                    <Input
                        fluid
                        type="text"
                        placeholder="Your answer"
                        disabled={this.props.isAnswer}
                        value={this.state.answer}
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        action={{ icon: 'paper plane', onClick: this.submitAnswer }}
                    />
                </Grid.Column>

            </Grid>
        )
    }
}
export default AnswerBox;