import React, { Component } from 'react';
import Canvas from './Game/canvas.jsx';
import Toolbox from './Game/toolbox.jsx';
import WordSelector from './Game/wordselector'
import AnswerBox from './Game/answerBox'
import { Grid, Segment } from 'semantic-ui-react';
class Game extends Component {
  constructor(props) {
    super(props);
    // this.canvas = null;
    this.state = {
      drawer: {
        brush: {
          size: '3',
          cap: 'round', //butt | square | round
          color: '#000000' //black
        }
      },
      showWordModal: true
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.vocab.word !== this.props.vocab.word) {
      if (this.props.vocab.word && this.props.vocab.hint) {
        this.setState({ showWordModal: false });
      } else {
        this.setState({ showWordModal: true });
      }

    }
  }
  changeBrushColor(color_code) {
    this.setState(state => {
      return {
        ...state,
        drawer: {
          ...state.drawer,
          brush: { ...state.drawer.brush, color: color_code }
        }
      };
    });
  }
  changeBrushSize(size) {
    const new_size = size;
    const real_size =
      new_size >= 1 && new_size <= 50 ? new_size : new_size > 50 ? 50 : 1;
    this.setState(state => {
      return {
        ...state,
        drawer: {
          ...state.drawer,
          brush: { ...state.drawer.brush, size: real_size }
        }
      };
    });
  }
  changeBrushCap(cap) {
    this.setState(state => {
      return {
        ...state,
        drawer: { ...state.drawer, brush: { ...state.drawer.brush, cap } }
      };
    });
  }
  handleNewCanvas(canvas) {
    this.props.onCanvasChange(canvas);
  }
  handleClearCanvas() {
    if (this.canvas) {
      this.canvas.clearCanvas();
    }
  }
  render() {
    return (
      <Segment>
        {this.props.isDrawer ?
          <Toolbox
            changeBrushColor={this.changeBrushColor.bind(this)}
            changeBrushSize={this.changeBrushSize.bind(this)}
            changeBrushCap={this.changeBrushCap.bind(this)}
            handleClearCanvas={this.handleClearCanvas.bind(this)}
          /> :
          <Grid textAlign="center" style={{ height: '150px' }}>
          </Grid>
        }
        {this.props.isDrawer ?
          <Grid textAlign="center" style={{ height: '50px' }}>
            <p>{this.props.vocab.word}</p>
          </Grid> :
          null
        }
        <Canvas
          isDrawer={this.props.isDrawer}
          drawer={this.props.drawer}
          newCanvas={this.props.newCanvas}
          ref={ref => (this.canvas = ref)}
          brushOptions={this.state.drawer.brush}
          onCanvasChange={this.handleNewCanvas.bind(this)}
        />
        {this.props.isDrawer && this.state.showWordModal ?
          <WordSelector
            playRoomId={this.props.playRoomId}
            showModal={this.state.showWordModal}
            onSelectWord={this.props.handleSelectWord}
          />
          :
          null
        }
        {!this.props.isDrawer ?
          <AnswerBox
            playRoomId={this.props.playRoomId}
            userId={this.props.userId}
            isAnswer={this.props.isAnswer}
            onAllCorrect={this.props.handleAllCorrect}
          /> : null}
      </Segment>
    );
  }
}

export default Game;
