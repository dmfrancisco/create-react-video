import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import IconButton from './IconButton';

const FPS = 30;

const controlBarGap = 10;
const controlBarHeight = 32;

const ControlBar = styled.div`
  background: rgba(0,0,0,.5);
  border-radius: 5px;
  bottom: ${controlBarGap}px;
  display: none;
  height: ${controlBarHeight}px;
  left: ${controlBarGap}px;
  line-height: ${controlBarHeight - 4}px;
  margin: 0 auto;
  max-width: calc(100% - ${controlBarGap * 2}px);
  position: absolute;
  right: ${controlBarGap}px;
  text-align: center;
  width: 280px;
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;

  &:hover ${ControlBar} {
    display: block;
  }
`;

export default class Player extends Component {
  static propTypes = {
    children: PropTypes.any,
    duration: PropTypes.number,
  }

  static defaultProps = {
    children: null,
    duration: 10,
  }

  static childContextTypes = {
    currentTime: PropTypes.number,
    play: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      currentTime: 0,
      playing: true,
    };
  }

  getChildContext() {
    return {
      currentTime: this.state.currentTime,
      play: this.state.playing,
    };
  }

  componentDidMount() {
    this.renderNextFrame();
  }

  componentDidUpdate() {
    this.renderNextFrame();
  }

  getCurrentChildren() {
    return Children.map(this.props.children, (child) => {
      const currentTime = this.state.currentTime;
      const beginTime = child.props.begin || 0;
      const endTime = child.props.end || this.props.duration;

      return beginTime <= currentTime && endTime >= currentTime ? child : null;
    });
  }

  backward = () => {
    this.setState({ currentTime: 0 });
  }

  forward = () => {
    this.setState({ currentTime: this.props.duration });
  }

  play = () => {
    this.setState({ playing: true });
  }

  pause = () => {
    this.setState({ playing: false });
  }

  renderNextFrame(tick = 1 / FPS) {
    clearTimeout(this.timer);

    if (!this.state.playing) return;

    if (this.state.currentTime >= this.props.duration) {
      this.pause();
    } else {
      this.timer = setTimeout(() => {
        this.setState({ currentTime: this.state.currentTime + tick });
      }, tick * 1000);
    }
  }

  renderControls() {
    return (
      <ControlBar>
        <IconButton onClick={this.backward} icon="backward" />
        { this.state.playing && <IconButton onClick={this.pause} icon="pause" large /> }
        { !this.state.playing && <IconButton onClick={this.play} icon="play" large /> }
        <IconButton onClick={this.forward} icon="forward" />
      </ControlBar>
    );
  }

  render() {
    return (
      <Container>
        { this.getCurrentChildren() }
        { this.renderControls() }
      </Container>
    );
  }
}
