import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Video extends Component {
  static contextTypes = {
    currentTime: PropTypes.number,
    play: PropTypes.bool,
  }

  static propTypes = {
    begin: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    startAt: PropTypes.number,
    eager: PropTypes.bool,
  }

  static defaultProps = {
    startAt: 0,
    eager: true,
  }

  componentDidMount() {
    this.didRender();
  }

  componentDidUpdate() {
    this.didRender();
  }

  setTime() {
    const onLoadedData = () => {
      this.node.removeEventListener('loadeddata', onLoadedData);
      this.node.currentTime = this.calcCurrentTime();
    };

    this.node.addEventListener('loadeddata', onLoadedData);
    if (this.node.readyState >= 2) onLoadedData();
  }

  calcCurrentTime() {
    return Math.max(this.context.currentTime - this.props.begin, 0) + this.props.startAt;
  }

  shouldBeVisible() {
    return this.context.currentTime >= this.props.begin &&
      this.context.currentTime <= this.props.end;
  }

  didRender() {
    this.node.hidden = !this.shouldBeVisible();

    if (this.context.play && this.shouldBeVisible()) {
      if (this.node.readyState >= 2) this.node.play();
    } else {
      // If the player is not playing, update the time.
      // The second condition is just to avoid setting time right after we pause,
      // because the frame may not be exactly the same and so causes a bit of shaking.
      if (!this.context.play && this.node.paused) this.setTime();
      this.node.pause();
    }
  }

  render() {
    const { startAt, end, eager, ...props } = this.props;

    return (
      <video
        ref={node => this.node = node}
        {...props}
        autoPlay={false}
        muted
      />
    );
  }
}
