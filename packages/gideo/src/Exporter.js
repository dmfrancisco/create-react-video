import React, { Component } from 'react';
import PropTypes from 'prop-types';
import leftPad from 'left-pad';

import Stage from './Stage';
import Audio from './Audio';
import extendChildrenProps from './extendChildrenProps';

const { remote } = window.require('electron');
const execa = remote.require('execa');
const fs = remote.require('fs');
const appWindow = remote.getCurrentWindow();

const FPS = 25;
const ffmpeg = 'ffmpeg';

export default class Exporter extends Component {
  static propTypes = {
    children: PropTypes.any,
    duration: PropTypes.number.isRequired,
    exportFilename: PropTypes.string.isRequired,
    onCompletion: PropTypes.func.isRequired,
  }

  static defaultProps = {
    children: null,
  }

  constructor(props) {
    super(props);

    const tmpDir = fs.mkdtempSync('/tmp/gideo-');

    this.state = {
      currentFrame: 0,
      tmpDir,
      tmpVideoOutput: `${tmpDir}/output.mkv`,
      audioChildren: extendChildrenProps(props.children)
        .filter(child => child.type === Audio)
        .map(child => child.props),
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.currentFrame !== nextState.currentFrame;
  }

  frameToTime(frame) {
    return frame / FPS;
  }

  generateAudio() {
    const args = ['-i', this.state.tmpVideoOutput];
    const filters = [];

    this.state.audioChildren.forEach(props => args.push('-i', `./public/${props.src}`));
    this.state.audioChildren.forEach((props, i) =>
      filters.push(`[${i + 1}:a]atrim=${props.begin}:${props.end},asetpts=PTS-STARTPTS[aud${i + 1}];`)
    );
    this.state.audioChildren.forEach((props, i) => filters.push(`[aud${i + 1}]`));
    filters.push(`concat=n=${this.state.audioChildren.length}:v=0:a=1[aout]`);

    args.push('-filter_complex', filters.join(''));
    args.push('-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac');
    args.push('-y', this.props.exportFilename);

    execa(ffmpeg, args)
      .then(() => {
        this.props.onCompletion();
      })
      .catch(error => console.error(error));
  }

  generateVideo() {
    execa(ffmpeg, [
      '-framerate', FPS,
      '-i', `${this.state.tmpDir}/%05d.png`,
      // Save lossless with fast encoding speed
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '0',
      '-y', // Don't ask the user to override file
      this.state.tmpVideoOutput,
    ])
      .then(() => {
        this.generateAudio();
      })
      .catch(error => console.error(error));
  }

  generateFrame(frame, callback) {
    appWindow.capturePage((img) => {
      const framePadded = leftPad(frame, 5, 0);
      fs.writeFile(`${this.state.tmpDir}/${framePadded}.png`, img.toPng(), callback);
    });
  }

  renderNextFrame = () => {
    if (this.frameToTime(this.state.currentFrame) >= this.props.duration) {
      this.generateVideo();
    } else {
      this.generateFrame(this.state.currentFrame, (error) => {
        let nextFrame = this.state.currentFrame + 1;
        if (error) {
          console.error(error);
          nextFrame -= 1;
        }
        this.setState({ currentFrame: nextFrame });
      });
    }
  }

  render() {
    console.log('Rendering frame', this.state.currentFrame);

    return (
      <Stage
        exporting
        currentTime={this.frameToTime(this.state.currentFrame)}
        onReady={this.renderNextFrame}
        {...this.props}
      >
        { this.props.children }
      </Stage>
    );
  }
}
