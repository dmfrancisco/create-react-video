import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Player from './Player';

const { remote, webFrame } = window.require('electron');

const Titlebar = styled.div`
  -webkit-app-region: drag;
  background: rgba(0,0,0,.5);
  display: none;
  font-size: 13px;
  font-weight: 400;
  height: 22px;
  left: 0;
  line-height: 22px;
  position: absolute;
  right: 0;
  text-align: center;
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

  &:hover ${Titlebar} {
    display: block;
  }
`;

export default class Gideo extends Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
  }

  static defaultProps = {
    height: 600,
    width: 600,
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
      <Container>
        <Titlebar>
          { document.title }
        </Titlebar>
        <Player {...this.props} />
      </Container>
    );
  }
}
