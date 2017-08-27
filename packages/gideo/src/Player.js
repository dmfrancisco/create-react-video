import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Stage from './Stage';
import IconButton from './IconButton';
import Timeline from './Timeline';

const FPS = 25;

const controlBarGap = 20;
const controlBarHeight = 60;

const ControlBar = styled.div`
  background: rgba(0,0,0,.7);
  border-radius: 5px;
  bottom: ${controlBarGap}px;
  height: ${controlBarHeight}px;
  left: ${controlBarGap}px;
  line-height: ${controlBarHeight - 4}px;
  margin: 0 auto;
  max-width: calc(100% - ${controlBarGap * 2}px);
  opacity: 0;
  position: absolute;
  right: ${controlBarGap}px;
  text-align: center;
  transition: opacity 200ms ease-in;
  width: 280px;
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;

  &:hover ${ControlBar},
  &.is-inactive ${ControlBar} {
    opacity: 1;
  }
`;

export default class Player extends Component {
  static propTypes = {
    children: PropTypes.any,
    duration: PropTypes.number.isRequired,
    inactive: PropTypes.bool.isRequired,
    startAt: PropTypes.number,
  }

  static defaultProps = {
    children: null,
    startAt: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      currentTime: this.props.startAt,
      playing: false,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keyup', this.handleKeyup);

    this.renderNextFrame();
  }

  componentDidUpdate(prevProps, prevState) {
    const wasPlaying = prevState.playing;
    this.renderNextFrame(wasPlaying);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('keyup', this.handleKeyup);
  }

  handleKeydown = (e) => {
    switch (e.which) {
      case 32: {
        if (this.spaceDown) break;

        this.spaceDown = +new Date();
        this.setState({ playing: !this.state.playing });
        break;
      }
      case 39: {
        this.setState({ playing: false, currentTime: this.state.currentTime + 1 / FPS });
        break;
      }
      case 37: {
        this.setState({ playing: false, currentTime: this.state.currentTime - 1 / FPS });
        break;
      }
      default:
    }
  }

  handleKeyup = (e) => {
    switch (e.which) {
      // If space key was quickly pressed, we want the video to toggle its state
      // If it's a long press, we want it to play and pause on release
      case 32: {
        if (!this.spaceDown) break;

        const now = +new Date();
        if (now - this.spaceDown > 400) {
          this.setState({ playing: !this.state.playing });
        }
        this.spaceDown = false;
        break;
      }
      default:
    }
  }

  handleTimelineClick = (currentTime) => {
    this.setState({ currentTime, playing: false });
  }

  backward = () => {
    this.setState({ currentTime: 0, playing: false });
  }

  forward = () => {
    this.setState({ currentTime: this.props.duration, playing: false });
  }

  play = () => {
    this.setState({ playing: true });
  }

  pause = () => {
    this.setState({ playing: false });
  }

  renderNextFrame(wasPlaying = false, tick = 1 / FPS) {
    clearTimeout(this.timer);

    if (!this.state.playing) return;

    if (this.state.currentTime >= this.props.duration) {
      this.pause();
    } else {
      this.timer = setTimeout(() => {
        const previousClock = (!wasPlaying || !this.state.clock) ? +new Date() : this.state.clock;
        const currentClock = +new Date();
        const clockDelta = (currentClock - previousClock) / 1000;

        this.setState({
          clock: currentClock,
          currentTime: this.state.currentTime + clockDelta,
        });
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

        <Timeline
          currentTime={this.state.currentTime}
          duration={this.props.duration}
          onClick={this.handleTimelineClick}
        />
      </ControlBar>
    );
  }

  render() {
    return (
      <Container className={this.props.inactive && 'is-inactive'}>
        <Stage
          currentTime={this.state.currentTime}
          playing={this.state.playing}
          {...this.props}
        >
          { this.props.children }
        </Stage>
        { this.renderControls() }
      </Container>
    );
  }
}
