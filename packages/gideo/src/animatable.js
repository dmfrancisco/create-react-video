import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Timer from '@robo54/timer';

export default function animatable(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      begin: PropTypes.number,
      currentTime: PropTypes.number,
      end: PropTypes.number,
    }

    static defaultProps = {
      begin: null,
      currentTime: null,
      end: null,
    }

    position = (beginValue, endValue, { delay = 0, duration, easing = 'linear' } = {}) => {
      const beginTime = this.props.begin + delay;
      const endTime = duration ? duration + beginTime : this.props.end;
      const currentTime = this.props.currentTime;
      const timer = new Timer({ duration: endTime - beginTime, easing });
      const now = +new Date();
      return timer.freeze(now, now + currentTime - beginTime);
    }

    animate = (beginValue, endValue, options) => {
      const position = this.position(beginValue, endValue, options);
      return beginValue + (endValue - beginValue) * position.value;
    }

    render() {
      return (
        <WrappedComponent
          position={this.position}
          animate={this.animate}
          {...this.props}
        />
      );
    }
  };
}
