import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Video extends Component {
  static contextTypes = {
    currentTime: PropTypes.number,
    play: PropTypes.bool,
  }

  componentDidMount() {
    this.didRender();
  }

  componentDidUpdate() {
    this.didRender();
  }

  onReadyState = () => {
    this.node.removeEventListener('loadeddata', this.onReadyState);

    this.setTime(this.context.currentTime);

    if (this.context.play) {
      this.node.play();
    } else {
      this.node.pause();
    }
  }

  onTimeUpdate = () => {
    this.node.removeEventListener('timeupdate', this.onTimeUpdate);
    // TODO: Video is ready
  }

  setTime(time) {
    this.node.addEventListener('timeupdate', this.onTimeUpdate);

    // If it's playing, we assume the currentTime is right
    if (this.context.play) {
      this.onTimeUpdate();
    } else {
      this.node.currentTime = time;
    }
  }

  didRender() {
    this.node.addEventListener('loadeddata', this.onReadyState);

    if (this.node.readyState >= 2) {
      this.onReadyState();
    }
  }

  render() {
    return (
      <video
        ref={node => this.node = node}
        {...this.props}
        autoPlay={false}
        muted
      />
    );
  }
}
