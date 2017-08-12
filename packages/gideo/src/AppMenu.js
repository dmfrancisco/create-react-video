import { Component } from 'react';
import PropTypes from 'prop-types';

const { Menu } = window.require('electron').remote;

export default class AppMenu extends Component {
  static propTypes = {
    onHelpClick: PropTypes.func.isRequired,
    onExportClick: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const template = [
      {
        label: 'Electron',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'Export Video…',
            click: this.props.onExportClick,
          },
          { type: 'separator' },
          { role: 'close' },
        ],
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },
      {
        role: 'window',
        submenu: [
          { role: 'close' },
          { role: 'minimize' },
          { role: 'zoom' },
          { type: 'separator' },
          { role: 'front' },
        ],
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: this.props.onHelpClick,
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  render() {
    return null;
  }
}
