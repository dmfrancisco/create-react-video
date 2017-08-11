import React, { Component } from 'react';
import PropTypes from 'prop-types';

function onLoadedData(node, callback) {
  if (node.readyState >= 2) return callback();

  const func = () => {
    node.removeEventListener('loadeddata', func);
    callback();
  };
  node.addEventListener('loadeddata', func);
}

export default class Video extends Component {
  static propTypes = {
    begin: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    eager: PropTypes.bool,
    end: PropTypes.number.isRequired,
    play: PropTypes.bool,
    playbackRate: PropTypes.number,
    startAt: PropTypes.number,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    currentTime: 0,
    eager: true,
    play: false,
    playbackRate: 1,
    startAt: 0,
    visible: null,
  }

  componentDidMount() {
    onLoadedData(this.node, () => {
      this.node.currentTime = this.calcNodeCurrentTime();
      this.node.playbackRate = this.props.playbackRate;
      this.node.hidden = !this.props.visible;
      if (this.props.play) this.node.play();
    });
  }

  componentWillReceiveProps(nextProps) {
    const visibleChanged = this.props.visible !== nextProps.visible;
    const playChanged = this.props.play !== nextProps.play;
    const propChanged = visibleChanged || playChanged;

    if (!nextProps.play) {
      onLoadedData(this.node, () => {
        // If the node is paused or we click backward, reset the time
        // If the element was playing don't set the time to avoid shaking frame
        if (this.node.paused || nextProps.currentTime === 0) {
          this.node.currentTime = this.calcNodeCurrentTime(nextProps);
        }
        this.node.pause();
      });
    }

    if (propChanged && nextProps.visible && nextProps.play) {
      onLoadedData(this.node, () => {
        this.node.play();
      });
    }

    if (visibleChanged) {
      this.node.hidden = !nextProps.visible;
      if (!nextProps.visible) this.node.pause();
    }

    // In case the user moved the current time using the timeline
    // 1 second is the minimum delta possible using the timeline, since values are rounded to seconds
    if (nextProps.visible && Math.abs(nextProps.currentTime - this.props.currentTime) >= 1) {
      this.node.currentTime = this.calcNodeCurrentTime(nextProps);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  calcNodeCurrentTime(props = this.props) {
    return props.startAt + (props.visible ? (props.currentTime - props.begin) * props.playbackRate : 0);
  }

  render() {
    const { startAt, end, playbackRate, eager, visible, currentTime, play, ...props } = this.props;

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
