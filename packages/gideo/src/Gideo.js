import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Player from './Player';

const remote = window.require('electron').remote;

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
    remote.getCurrentWindow()
      .setAspectRatio(this.props.width / this.props.height);

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
