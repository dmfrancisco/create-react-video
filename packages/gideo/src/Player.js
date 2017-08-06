import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Player extends Component {
  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}
