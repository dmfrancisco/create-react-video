import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Svg = styled.svg`
  fill: currentcolor;
  vertical-align: middle;
`;

export default class Icon extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    large: PropTypes.bool,
  }

  static defaultProps = {
    large: false,
  }

  renderGraphic() {
    switch (this.props.icon) {
      case 'play':
        return (
          <g><path d="M12,8c0-0.35-0.19-0.64-0.46-0.82l0.01-0.02l-6-4L5.54,3.18 C5.39,3.08,5.21,3,5,3C4.45,3,4,3.45,4,4v8c0,0.55,0.45,1,1,1c0.21,0,0.39-0.08,0.54-0.18l0.01,0.02l6-4l-0.01-0.02 C11.81,8.64,12,8.35,12,8z"/></g>
        );
      case 'pause':
        return (
          <g><path d="M6,3H4C3.45,3,3,3.45,3,4v8c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1V4 C7,3.45,6.55,3,6,3z M12,3h-2C9.45,3,9,3.45,9,4v8c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1V4C13,3.45,12.55,3,12,3z"/></g>
        );
      case 'backward':
        return (
          <g><path d="M12,3c-0.24,0-0.44,0.09-0.62,0.23l-0.01-0.01L7,6.72V4c0-0.55-0.45-1-1-1H5 C4.45,3,4,3.45,4,4v8c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1V9.28l4.38,3.5l0.01-0.01C11.56,12.91,11.76,13,12,13 c0.55,0,1-0.45,1-1V4C13,3.45,12.55,3,12,3z"/></g>
        );
      case 'forward':
        return (
          <g><path d="M12,3h-1c-0.55,0-1,0.45-1,1v2.72l-4.38-3.5L5.62,3.23C5.44,3.09,5.24,3,5,3 C4.45,3,4,3.45,4,4v8c0,0.55,0.45,1,1,1c0.24,0,0.44-0.09,0.62-0.23l0.01,0.01L10,9.28V12c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1 V4C13,3.45,12.55,3,12,3z"/></g>
        );
      default:
        return null;
    }
  }

  renderLargeGraphic() {
    switch (this.props.icon) {
      case 'play':
        return (
          <g><path d="M16,10c0-0.36-0.2-0.67-0.49-0.84l0.01-0.01l-10-6L5.51,3.16 C5.36,3.07,5.19,3,5,3C4.45,3,4,3.45,4,4v12c0,0.55,0.45,1,1,1c0.19,0,0.36-0.07,0.51-0.16l0.01,0.01l10-6l-0.01-0.01 C15.8,10.67,16,10.36,16,10z"/></g>
        );
      case 'pause':
        return (
          <g><path d="M7,3H4C3.45,3,3,3.45,3,4v12c0,0.55,0.45,1,1,1h3c0.55,0,1-0.45,1-1V4 C8,3.45,7.55,3,7,3z M16,3h-3c-0.55,0-1,0.45-1,1v12c0,0.55,0.45,1,1,1h3c0.55,0,1-0.45,1-1V4C17,3.45,16.55,3,16,3z"/></g>
        );
      case 'backward':
        return (
          <g><path d="M15,3c-0.23,0-0.42,0.09-0.59,0.21L14.4,3.2L8,8V4c0-0.55-0.45-1-1-1H5 C4.45,3,4,3.45,4,4v12c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-4l6.4,4.8l0.01-0.01C14.58,16.91,14.77,17,15,17c0.55,0,1-0.45,1-1 V4C16,3.45,15.55,3,15,3z"/></g>
        );
      case 'forward':
        return (
          <g><path d="M15,3h-2c-0.55,0-1,0.45-1,1v4L5.6,3.2L5.59,3.21C5.42,3.09,5.23,3,5,3 C4.45,3,4,3.45,4,4v12c0,0.55,0.45,1,1,1c0.23,0,0.42-0.09,0.59-0.21L5.6,16.8L12,12v4c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1V4 C16,3.45,15.55,3,15,3z"/></g>
        );
      default:
        return null;
    }
  }

  render() {
    const size = this.props.large ? 20 : 16;

    return (
      <Svg
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
        width={size * 2}
        height={size * 2}
      >
        { this.props.large ? this.renderLargeGraphic() : this.renderGraphic() }
      </Svg>
    );
  }
}
