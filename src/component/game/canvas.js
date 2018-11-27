import React, { Component } from "react";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = { strokeStyle: "#000000", lineWidth: 1, lineCap: "round" };
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);
  }

  isPainting = false;

  // userStrokeStyle = "#000000";

  line = [];

  prevPos = { offsetX: 0, offsetY: 0 };
  onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
  }
  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      const positionData = {
        start: { ...this.prevPos },
        stop: { ...offSetData }
      };

      this.line = this.line.concat(positionData);
      this.paint(this.prevPos, offSetData, this.state.strokeStyle);
    }
  }
  endPaintEvent() {
    if (this.isPainting) {
      this.isPainting = false;
      //send data to database
    }
  }
  paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;

    this.ctx.moveTo(x, y);

    this.ctx.lineTo(offsetX, offsetY);

    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }
  clearCanvas() {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  componentDidMount() {
    this.canvas.width = 1000;
    this.canvas.height = 800;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = this.state.lineCap;
    this.ctx.lineWidth = this.state.lineWidth;
  }
  static getDerivedStateFromProps(props, state) {
    const newBrushOptions = {
      strokeStyle: props.brushOptions.color,
      lineWidth: props.brushOptions.size,
      lineCap: props.brushOptions.cap
    };
    if (state !== newBrushOptions) {
      return {
        ...newBrushOptions
      };
    }
    return null;
  }
  componentDidUpdate(prevProps) {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = this.state.lineCap;
    this.ctx.lineWidth = this.state.lineWidth;
  }
  render() {
    return (
      <canvas
        ref={ref => (this.canvas = ref)}
        style={{ background: "white" }}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.endPaintEvent}
        onMouseUp={this.endPaintEvent}
        onMouseMove={this.onMouseMove}
      />
    );
  }
}
export default Canvas;
