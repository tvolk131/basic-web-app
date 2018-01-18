import React, { Component } from 'react';
import pressed from './pressed.png';
import unpressed from './unpressed.png';

class GoogleButton extends Component {
  constructor (props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.clickRelease = this.clickRelease.bind(this);
    this.style = {
      transition: 'background-color 0.218s, border-color 0.218s, box-shadow 0.218s',
      outline: 'none',
      borderRadius: '3px',
      WebkitFilter: 'drop-shadow(2px 2px 3px #555)'
    }
    this.state = {
      imageSrc: unpressed
    };
  }

  onClick () {
    this.props.onClick();
    this.setState({imageSrc: pressed});
  }
  clickRelease () {
    this.setState({imageSrc: unpressed});
  }

  // height: 50px; width: 240px; border: none; font-size: 16px; line-height: 48px; display: block; border-radius: 1px;

  render () {
    return <input onMouseDown={this.onClick} onMouseUp={this.clickRelease} type='image' src={this.state.imageSrc} style={this.style} />
  }
}

export default GoogleButton;