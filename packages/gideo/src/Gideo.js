import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Player from './Player';

const { remote, webFrame } = window.require('electron');

const Titlebar = styled.div`
  -webkit-app-region: drag;
  background: rgba(0,0,0,.7);
  font-size: 13px;
  font-weight: 400;
  height: 22px;
  left: 0;
  line-height: 22px;
  opacity: 0;
  position: absolute;
  right: 0;
  text-align: center;
  transition: opacity 200ms ease-in;
  z-index: 9000;
`;

const Container = styled.div`
  background: #222;
  color: #fff;
  cursor: default;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif, "Apple Color Emoji";
  height: 100vh;
  overflow: hidden;
  user-select: none;
  width: 100vw;

  &:hover ${Titlebar},
  &.is-inactive ${Titlebar} {
    opacity: 1;
  }
`;

export default class Gideo extends Component {
  static propTypes = {
    title: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
  }

  static defaultProps = {
    title: null,
    height: 600,
    width: 600,
  }

  constructor(props) {
    super(props);

    this.state = {
      inactive: false,
    };
  }

  componentDidMount() {
    window.addEventListener('blur', this.inactivateWindow);
    window.addEventListener('focus', this.activateWindow);
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.inactivateWindow);
    window.removeEventListener('focus', this.activateWindow);
  }

  inactivateWindow = () => {
    this.setState({ inactive: true });
  }

  activateWindow = () => {
    this.setState({ inactive: false });
  }

  render() {
    const window = remote.getCurrentWindow();
    const aspectRatio = this.props.width / this.props.height;
    const windowWidth = window.getSize()[0];
    const windowHeight = Math.round(windowWidth * this.props.height / this.props.width);
    const windowMinWidth = 256;
    const windowMinHeight = Math.round(windowMinWidth * aspectRatio);

    // Enforce this aspect ratio
    window.setAspectRatio(aspectRatio);

    // Update the window size
    // We don't programmatically update width so we know it won't be less than the minimum allowed
    window.setSize(windowWidth, windowHeight, true);
    window.setMinimumSize(windowMinWidth, windowMinHeight);

    // Disable zoom
    webFrame.setVisualZoomLevelLimits(1, 1);
    webFrame.setLayoutZoomLevelLimits(0, 0);

    return (
      <Container className={this.state.inactive && 'is-inactive'}>
        <Titlebar>
          { this.props.title }
        </Titlebar>
        <Player
          inactive={this.state.inactive}
          {...this.props}
        />
      </Container>
    );
  }
}
