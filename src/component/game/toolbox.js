import React, { Component } from "react";
class Game extends Component {
  constructor(props) {
    super(props);
  }
  colors_list = {
    black: "#000000", //black
    red: "#FF0000", //red
    green: "#00FF00", //green
    blue: "#0000FF" ///blue
  };
  brush_size_lists = [1, 2, 5, 10];
  handleClickColor(color_code) {
    this.props.changeBrushColor(color_code);
  }
  handleClickSize(size) {
    this.props.changeBrushSize(size);
  }
  handleClickEraser() {
    this.props.changeBrushColor("#FFFFFF");
    this.props.changeBrushCap("round");
  }
  handleClickClear() {
    this.props.handleClearCanvas();
  }
  render() {
    var color_button = Object.keys(this.colors_list).map(color => (
      <button
        onClick={this.handleClickColor.bind(this, this.colors_list[color])}
      >
        {color}
      </button>
    ));
    var size_button = this.brush_size_lists.map(size => (
      <div>
        <button onClick={this.handleClickSize.bind(this, size)}>
          + {size}
        </button>
        <button onClick={this.handleClickSize.bind(this, -1 * size)}>
          - {size}
        </button>
      </div>
    ));
    var eraser_button = (
      <button onClick={this.handleClickEraser.bind(this)}>Eraser</button>
    );
    var reset_button = (
      <button onClick={this.handleClickClear.bind(this)}>Clear</button>
    );
    return (
      <div>
        {color_button} {size_button} {reset_button} {eraser_button}
      </div>
    );
  }
}

export default Game;
