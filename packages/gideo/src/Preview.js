import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Preview extends Component {
  static propTypes = {
    children: PropTypes.any,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    style: PropTypes.object,
  }

  static defaultProps = {
    children: null,
    style: {},
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.content.style.transform = `scale(${this.container.offsetWidth / this.props.width})`;
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
        width: this.props.width,
        height: this.props.height,
        overflow: 'hidden',
        transformOrigin: 'top left',
      },
    };

    return (
      <div ref={container => this.container = container} style={style.container}>
        <div ref={content => this.content = content} style={{ ...this.props.style, ...style.content }}>
          { this.props.children }
        </div>
      </div>
    );
  }
}
