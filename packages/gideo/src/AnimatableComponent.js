import { Component } from 'react';
import PropTypes from 'prop-types';
import Timer from 'timer-js';

export default class AnimatableComponent extends Component {
  static contextTypes = {
    currentTime: PropTypes.number,
  }

  static propTypes = {
    begin: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
  }

  position(beginValue, endValue, { delay = 0, duration, easing = 'linear' } = {}) {
    const beginTime = this.props.begin + delay;
    const endTime = duration ? duration + beginTime : this.props.end;
    const currentTime = this.context.currentTime;
    const timer = new Timer({ duration: endTime - beginTime, easing });
    const now = +new Date();
    return timer.freeze(now, now + currentTime - beginTime);
  }

  animate(beginValue, endValue, options) {
    const position = this.position(beginValue, endValue, options);
    return beginValue + (endValue - beginValue) * position.value;
  }
}
