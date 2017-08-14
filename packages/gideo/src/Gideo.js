import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AppMenu from './AppMenu';
import Player from './Player';
import Exporter from './Exporter';

const { remote, webFrame, shell } = window.require('electron');

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
    name: PropTypes.string,
    height: PropTypes.number,
    windowMinWidth: PropTypes.number,
    width: PropTypes.number,
  }

  static defaultProps = {
    name: null,
    height: 600,
    windowMinWidth: 256,
    width: 600,
  }

  constructor(props) {
    super(props);

    this.state = {
      exporting: false,
      exportFilename: null,
      fullscreen: false,
      inactive: false,
    };
  }

  componentDidMount() {
    window.addEventListener('blur', this.inactivateWindow);
    window.addEventListener('focus', this.activateWindow);

    const appWindow = remote.getCurrentWindow();
    appWindow.on('enter-full-screen', this.enterFullscreen);
    appWindow.on('leave-full-screen', this.leaveFullscreen);

    // Disable zoom
    webFrame.setVisualZoomLevelLimits(1, 1);
    webFrame.setLayoutZoomLevelLimits(0, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.inactivateWindow);
    window.removeEventListener('focus', this.activateWindow);
  }

  enterFullscreen = () => {
    this.setState({ fullscreen: true });
  }

  leaveFullscreen = () => {
    this.setState({ fullscreen: false });
  }

  inactivateWindow = () => {
    this.setState({ inactive: true });
  }

  activateWindow = () => {
    this.setState({ inactive: false });
  }

  handleHelpClick = () => {
    shell.openExternal('https://github.com/robo54/create-react-video');
  }

  handleExportClick = () => {
    const defaultPath = `${this.props.name || 'Video'}.mkv`;
    const appWindow = remote.getCurrentWindow();

    remote.dialog.showSaveDialog(appWindow, { defaultPath }, (exportFilename) => {
      this.setState({ exporting: true, exportFilename });
    });
  }

  handleExportCompletion = () => {
    new Notification('Export completed', {
      body: 'The video file was successfully exported.',
    });
    this.setState({ exporting: false, exportFilename: null });
  }

  render() {
    const { exporting, fullscreen, inactive } = this.state;

    const appWindow = remote.getCurrentWindow();
    const aspectRatio = this.props.width / this.props.height;
    const windowWidth = appWindow.getSize()[0];
    const windowHeight = Math.round(windowWidth * this.props.height / this.props.width);
    const windowMinWidth = this.props.windowMinWidth;
    const windowMinHeight = Math.round(windowMinWidth * aspectRatio);

    // Enforce this aspect ratio
    appWindow.setAspectRatio(aspectRatio);

    // Update the window size
    // We don't programmatically update width so we know it won't be less than the minimum allowed
    appWindow.setSize(windowWidth, windowHeight, true);
    appWindow.setMinimumSize(windowMinWidth, windowMinHeight);

    return (
      <Container className={inactive && 'is-inactive'}>
        <AppMenu
          onHelpClick={this.handleHelpClick}
          onExportClick={this.handleExportClick}
        />
        { !fullscreen && !exporting && (
          <Titlebar>
            { this.props.name }
          </Titlebar>
        )}
        { !exporting && (
          <Player
            inactive={inactive}
            {...this.props}
          />
        )}
        { exporting && (
          <Exporter
            onCompletion={this.handleExportCompletion}
            exportFilename={this.state.exportFilename}
            {...this.props}
          />
        )}
      </Container>
    );
  }
}
