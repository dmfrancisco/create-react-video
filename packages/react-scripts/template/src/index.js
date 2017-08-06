import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Gideo from '@operador6/gideo';

class Project extends Component {
  render() {
    return (
      <Gideo aspectRatio={1} duration={10}>
        Hello, World!
      </Gideo>
    );
  }
}

ReactDOM.render(<Project />, document.getElementById('root'));
