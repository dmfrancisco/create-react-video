import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Gideo from '@operador6/gideo';

class Project extends Component {
  render() {
    return (
      <div>
        Hello, World!
      </div>
    );
  }
}

ReactDOM.render((
  <Gideo aspectRatio={1} duration={10}>
    <Project />
  </Gideo>
), document.getElementById('root'));
