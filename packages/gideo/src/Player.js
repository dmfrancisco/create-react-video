import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Preview from './Preview';
import IconButton from './IconButton';

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
  -webkit-font-smoothing: antialiased;

  &:hover ${ControlBar} {
    opacity: 1;
  }
`;

export default class Player extends Component {
  static propTypes = {
    children: PropTypes.any,
    startAt: PropTypes.number,
    duration: PropTypes.number,
  }

  static defaultProps = {
    children: null,
    startAt: 0,
    duration: 10,
  }

  static childContextTypes = {
    currentTime: PropTypes.number,
    play: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      currentTime: this.props.startAt,
      playing: false,
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

  componentDidUpdate(prevProps, prevState) {
    const wasPlaying = prevState.playing;
    this.renderNextFrame(wasPlaying);
  }

  getCurrentChildren() {
    return Children.map(this.props.children, (child) => {
      const currentTime = this.state.currentTime;
      const beginTime = child.props.begin || 0;
      const endTime = child.props.end || this.props.duration;

      const started = beginTime <= currentTime;
      const ended = endTime < currentTime;

      if (child.props.eager) {
        return React.cloneElement(child, {
          visible: started && !ended,
          currentTime: this.state.currentTime,
          play: this.state.playing,
        });
      }
      return started && !ended ? child : null;
    });
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
      </ControlBar>
    );
  }

  render() {
    return (
      <Container>
        <Preview {...this.props}>
          { this.getCurrentChildren() }
        </Preview>
        { this.renderControls() }
      </Container>
    );
  }
}
