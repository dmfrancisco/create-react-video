import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Media from './Media';

export default class Video extends Component {
  static propTypes = {
    eager: PropTypes.bool,
    waitForReady: PropTypes.bool,
  }

  static defaultProps = {
    eager: true,
    waitForReady: true,
  }

  render() {
    const { eager, ...props } = this.props;
    return (
      <Media type="video" {...props} />
    );
  }
}
