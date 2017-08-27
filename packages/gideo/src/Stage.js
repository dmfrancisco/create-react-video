import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

import extendChildrenProps from './extendChildrenProps';

export default class Stage extends Component {
  static propTypes = {
    children: PropTypes.any,
    currentTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    exporting: PropTypes.bool,
    height: PropTypes.number.isRequired,
    onReady: PropTypes.func,
    playing: PropTypes.bool,
    style: PropTypes.object,
    width: PropTypes.number.isRequired,
  }

  static defaultProps = {
    children: null,
    exporting: false,
    onReady() {},
    playing: false,
    style: {},
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
    if (this.totalDeferred === 0) this.props.onReady();
  }

  componentDidUpdate() {
    if (this.totalDeferred === 0) this.props.onReady();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.content.style.transform = `scale(${this.container.offsetWidth / this.props.width})`;
  }

  getCurrentChildren() {
    const children = extendChildrenProps(this.props.children);

    this.deferred = 0;
    this.totalDeferred = 0;

    return children.map((child, index) => {
      const currentTime = this.props.currentTime;
      const beginTime = child.props.begin || 0;
      const endTime = child.props.end || this.props.duration;
      const started = beginTime <= currentTime;
      const ended = endTime < currentTime;
      const visible = started && !ended;

      const childProps = {
        ...child.props,
        key: index,
        play: this.props.playing,
        currentTime,
        visible,
      };

      if (this.props.exporting && visible && childProps.waitForReady) {
        this.totalDeferred += 1;

        return React.cloneElement(child, {
          ...childProps,
          onReady: () => {
            this.deferred += 1;
            if (this.deferred === this.totalDeferred) this.props.onReady();
          },
        });
      }
      if (visible || (childProps.eager && !this.props.exporting)) {
        return React.cloneElement(child, childProps);
      }
      return null;
    });
  }

  render() {
    const style = {
      container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      },
      content: {
        WebkitFontSmoothing: 'antialiased',
        height: this.props.height,
        overflow: 'hidden',
        transformOrigin: 'top left',
        width: this.props.width,
      },
    };

    return (
      <div ref={container => this.container = container} style={style.container}>
        <div ref={content => this.content = content} style={{ ...this.props.style, ...style.content }}>
          { this.getCurrentChildren() }
        </div>
      </div>
    );
  }
}
