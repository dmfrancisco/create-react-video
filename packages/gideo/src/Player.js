import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

export default class Player extends Component {
  static propTypes = {
    aspectRatio: PropTypes.number.isRequired,
    children: PropTypes.object.isRequired,
  }

  static defaultProps = {
    aspectRatio: 1,
  }

  render() {
    remote.getCurrentWindow()
      .setAspectRatio(this.props.aspectRatio);

    return (
      <Container>
        <Titlebar>
          { document.title }
        </Titlebar>

        { this.props.children }
      </Container>
    );
  }
}
