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
      const lineData = {
        ...positionData,
        strokeStyle: this.state.strokeStyle,
        lineWidth: this.state.lineWidth,
        // userId:...
      };

      this.line = this.line.concat(lineData);
      this.paint(this.prevPos, offSetData, this.state.strokeStyle, this.state.lineWidth);
    }
  }
  endPaintEvent() {
    if (this.isPainting) {
      this.isPainting = false;
      this.props.onCanvasChange(this.line)
      //send data to database
    }
  }
  paint(prevPos, currPos, strokeStyle, lineWidth) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;

    this.ctx.moveTo(x, y);

    this.ctx.lineTo(offsetX, offsetY);

    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }
  clearCanvas() {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.line = [];
    this.props.onCanvasChange(this.line)
  }
  componentDidMount() {

    this.canvas.width = 1000;
    this.canvas.height = 800;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = this.state.lineCap;
  }
  static getDerivedStateFromProps(props, state) {
    if (props) {
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
    }
    return null;
  }
  componentDidUpdate(prevProps, prevState) {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = this.state.lineCap;
    this.ctx.lineWidth = this.state.lineWidth;
    if ((this.props.newCanvas !== prevProps) && (this.props.newCanvas !== this.line) && this.props.newCanvas && this.props.newCanvas.length) {
      // if (!currentUserId !== this.props.drawer.id) {
      if (!this.isPainting) {
        this.props.newCanvas.forEach(paintData => {
          this.paint(paintData.start, paintData.stop, paintData.strokeStyle, paintData.lineWidth);
        })
      }
    }
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
