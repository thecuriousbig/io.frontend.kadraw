import React, { Component } from 'react';
import { GithubPicker } from 'react-color';
import { Button, Icon, Grid } from 'semantic-ui-react';
class Game extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    color: 'grey',
    isPickerVisible: false
  };

  // brush_size_lists = [1, 2, 5, 10];

  handleClickColor = color => {
    this.setState({ color: color.hex });
    this.props.changeBrushColor(this.state.color);
    this.props.changeBrushSize('2');
  };

  handleClickSize(size) {
    this.props.changeBrushSize(size);
  }
  handleClickEraser = () => {
    this.props.changeBrushColor('#FFFFFF');
    this.props.changeBrushSize('3');
  };
  handleClickClear = () => {
    this.props.handleClearCanvas();
  };

  renderPickColorButton = event => {
    let a = !this.state.isPickerVisible;
    console.log('aaaaa ', this.state.isPickerVisible, a);
    this.setState({ isPickerVisible: a });
  };

  render() {
    var eraser_button = (
      <Button basic onClick={this.handleClickEraser} icon>
        <Icon name="eraser" />
      </Button>
    );
    var reset_button = (
      <Button basic icon onClick={this.handleClickClear}>
        <Icon name="trash" />
      </Button>
    );

    return (
      <div>
        <Grid textAlign="center" style={{ height: '150px' }}>
          <Grid.Column>{reset_button}</Grid.Column>
          <Grid.Column>{eraser_button}</Grid.Column>
          <Grid.Column>
            <Grid.Row>
              <Button basic icon onClick={this.renderPickColorButton}>
                <Icon name="tint" style={{ color: this.state.color }} />
              </Button>
            </Grid.Row>
            <Grid.Row>
              {this.state.isPickerVisible ? (
                <GithubPicker
                  color={this.state.color}
                  onChangeComplete={this.handleClickColor}
                />
              ) : (
                ''
              )}
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Game;

// var size_button = this.brush_size_lists.map(size => (
//   <div>
//   <button onClick={this.handleClickSize.bind(this, size)}>
//     + {size}
//   </button>
//   <button onClick={this.handleClickSize.bind(this, -1 * size)}>
//     - {size}
//   </button>
// </div>
// ));
