import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';

export default class Timeline extends Component {
  static propTypes = {
    duration: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.onClick = throttle(this.onClick, 500);
  }

  onClick = (time) => {
    this.props.onClick(time);
  }

  handleMouseDown = (e) => {
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMove);

    this.mouseDown = true;
    this.elementPos = e.target.getBoundingClientRect();

    this.handleClick(e);
  }

  handleClick = (e) => {
    const elementWidth = this.elementPos.right - this.elementPos.left;
    const clickPos = e.pageX - this.elementPos.left;
    const time = Math.round(this.props.duration * clickPos / elementWidth);

    this.onClick(Math.min(Math.max(time, 0), this.props.duration));
  }

  handleMouseUp = () => {
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);

    this.mouseDown = false;
  }

  handleMouseMove = (e) => {
    if (!this.mouseDown) return;
    this.handleClick(e);
  }

  render() {
    const barHeight = 4;
    const spaceAbove = 10; // Some extra space to make clicking easier
    const spaceBelow = 20;

    const style = {
      container: {
        bottom: -spaceBelow,
        height: spaceBelow + barHeight + spaceAbove,
        left: 0,
        position: 'absolute',
        right: 0,
      },
      timeline: {
        background: '#666',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        height: barHeight,
        left: 0,
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: spaceAbove,
      },
      selected: {
        background: '#fff',
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: `${100 - this.props.currentTime * 100 / this.props.duration}%`,
        top: 0,
      },
    };

    return (
      <div
        style={style.container}
        onMouseDown={this.handleMouseDown}
      >
        <div style={style.timeline}>
          <div style={style.selected} />
        </div>
      </div>
    );
  }
}
