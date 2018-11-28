import React, { Component } from "react";
import Canvas from "./Game/canvas.jsx";
import Toolbox from "./Game/toolbox.jsx";
class Game extends Component {
  constructor(props) {
    super(props);
    // this.canvas = null;
    this.state = {
      drawer: {
        brush: {
          size: 0,
          cap: "round", //butt | square | round
          color: "#000000" //black
        }
      }
    };
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
    const new_size = this.state.drawer.brush.size + size;
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

    return (<div>
      <Canvas drawer={this.props.drawer} newCanvas={this.props.newCanvas} ref={ref => (this.canvas = ref)} brushOptions={this.state.drawer.brush} onCanvasChange={this.handleNewCanvas.bind(this)} />
      <Toolbox changeBrushColor={this.changeBrushColor.bind(this)} changeBrushSize={this.changeBrushSize.bind(this)} changeBrushCap={this.changeBrushCap.bind(this)} handleClearCanvas={this.handleClearCanvas.bind(this)} />
    </div>);
  }
}

export default Game;