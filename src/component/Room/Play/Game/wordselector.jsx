import React, { Component } from 'react'
import firebase from '../../../../config/firebase'
import chance from 'chance'
import { Grid, Segment, Divider, Input, Button, Image, Header, Modal, Dropdown, Message } from 'semantic-ui-react'

class WordSelector extends Component {
    constructor(props) {
        super(props)
        this.wordRef = firebase.firestore().collection('Vocab')

        this.state = {
            easyWord: '',
            easyWordHint: '',
            normalWord: '',
            normalWordHint: '',
            hardWord: '',
            hardWordHint: '',
            selectWord: '',
            selectWordHint: '',
            remain: 1,
            isSkip: false,
            showModal: true,
            // roomNumber: ''
        }
    }

    async  componentDidMount() {
        this.setState({ showModal: this.props.showModal })
        this.randomNewWord()
    }

    inputAdd = async () => {
        const easyWord = {
            word: this.state.word,
            hint: this.state.hint
        }
        await this.wordRef
            .doc('Easy').collection('vocab')
            .doc(this.state.wordNumber)
            .set(easyWord).then(doc => {
                console.log(`add complete`)
            })
            .catch(err => console.log('err ', err))
    }

    randomNewWord = async () => {
        let tmpEasyWord
        let tmpEasyWordHint
        let tmpNormalWord
        let tmpNormalWordHint
        let tmpHardWord
        let tmpHardWordHint
        let rndnumber = chance
            .Chance()
            .integer({ min: 0, max: 19 })
            .toString()
        await this.wordRef.doc('Easy').collection('vocab')
            .doc(rndnumber).get()
            .then(doc => {
                console.log(doc.data().name)
                tmpEasyWord = doc.data().name
                tmpEasyWordHint = doc.data().hint
                rndnumber = chance
                    .Chance()
                    .integer({ min: 0, max: 19 })
                    .toString()
                this.wordRef.doc('Normal').collection('vocab')
                    .doc(rndnumber).get()
                    .then(doc => {
                        console.log(doc.data().name)
                        tmpNormalWord = doc.data().name
                        tmpNormalWordHint = doc.data().hint
                        rndnumber = chance
                            .Chance()
                            .integer({ min: 0, max: 19 })
                            .toString()
                        this.wordRef.doc('Hard').collection('vocab')
                            .doc(rndnumber).get()
                            .then(doc => {
                                tmpHardWord = doc.data().name
                                tmpHardWordHint = doc.data().hint

                                this.setState({
                                    easyWord: tmpEasyWord,
                                    easyWordHint: tmpEasyWordHint,
                                    normalWord: tmpNormalWord,
                                    normalWordHint: tmpNormalWordHint,
                                    hardWord: tmpHardWord,
                                    hardWordHint: tmpHardWordHint
                                })
                            })
                    })

            })


    }

    handleChange = async (event, data) => {
        if (event.target.name === 'changeword') {
            if (this.state.remain > 0) {
                let tmpremain = this.state.remain
                tmpremain = tmpremain - 1
                this.setState({ remain: tmpremain })
                this.randomNewWord()
            }

        } else if (event.target.name === 'selecteasyword') {
            await this.sendData(this.state.easyWord, this.state.easyWordHint)
        } else if (event.target.name === 'selectnormalword') {
            await this.sendData(this.state.normalWord, this.state.normalWordHint)
        } else if (event.target.name === 'selecthardword') {
            await this.sendData(this.state.hardWord, this.state.hardWordHint)
        } else {
            this.setState({ showModal: false })
            this.setState({ isSkip: true })
        }
    }

    sendData = async (word, hint) => {
        let playroomRef = firebase.firestore().collection('PlayRoom').doc(this.props.playRoomId)
        console.log(this.state.selectWord)
        await playroomRef.update({ vocab: { word: word, hint: hint } })
            .then(doc => {
                this.setState({ showModal: false })

            })
            .catch(err => console.log('err ', err))
        this.props.onSelectWord()

    }

    render() {
        return (
            <Modal size={'mini'} open={this.state.showModal} >
                <Modal.Header>Pick one word</Modal.Header>
                <Modal.Content>
                    <Button name='selecteasyword' onClick={this.handleChange} basic color='blue'>{this.state.easyWord}</Button>
                    <Button name='selectnormalword' onClick={this.handleChange} basic color='blue'>{this.state.normalWord}</Button>
                    <Button name='selecthardword' onClick={this.handleChange} basic color='blue'>{this.state.hardWord}</Button>
                </Modal.Content>
                <Modal.Actions>
                    <Button name='changeword' onClick={this.handleChange} color='blue'>Change word({this.state.remain})</Button>
                    <Button name='skip' onClick={this.handleChange} basic color='blue'>skip</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default WordSelector