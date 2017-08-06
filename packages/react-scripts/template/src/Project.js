import React, { Component } from 'react';
import './Project.css';

class Project extends Component {
  render() {
    return (
      <div className="Project">
        <div className="Project-header">
          <h2>Welcome to React</h2>
        </div>
        <p className="Project-intro">
          To get started, edit <code>src/Project.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default Project;
