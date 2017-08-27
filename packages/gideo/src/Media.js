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

function onTimeUpdated(node, callback) {
  const func = () => {
    node.removeEventListener('timeupdate', func);
    callback();
  };
  node.addEventListener('timeupdate', func);
}

export default class Media extends Component {
  static propTypes = {
    begin: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    onReady: PropTypes.func,
    play: PropTypes.bool,
    playbackRate: PropTypes.number,
    startAt: PropTypes.number,
    type: PropTypes.string.isRequired,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    currentTime: 0,
    onReady() {},
    play: false,
    playbackRate: 1,
    startAt: 0,
    visible: null,
  }

  componentDidMount() {
    onLoadedData(this.node, () => {
      onTimeUpdated(this.node, () => window.requestAnimationFrame(this.props.onReady));
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
        onTimeUpdated(this.node, () => window.requestAnimationFrame(this.props.onReady));
        this.node.currentTime = this.calcNodeCurrentTime(nextProps);
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
  }

  shouldComponentUpdate() {
    return false;
  }

  calcNodeCurrentTime(props = this.props) {
    return props.startAt + (props.visible ? (props.currentTime - props.begin) * props.playbackRate : 0);
  }

  render() {
    const { startAt, end, playbackRate, visible, currentTime, play, onReady, // eslint-disable-next-line react/prop-types
      startWith, endWith, startAfter, duration, waitForReady, ...props } = this.props;

    switch (this.props.type) {
      case 'video': {
        return (
          <video
            ref={node => this.node = node}
            {...props}
            autoPlay={false}
            muted
            hidden
          />
        );
      }
      case 'audio': {
        return (
          <audio
            ref={node => this.node = node}
            {...props}
            autoPlay={false}
          />
        );
      }
      default:
        return null;
    }
  }
}
