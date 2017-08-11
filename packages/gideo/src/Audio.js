import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Media from './Media';

export default class Audio extends Component {
  static propTypes = {
    eager: PropTypes.bool,
  }

  static defaultProps = {
    eager: true,
  }

  render() {
    const { eager, ...props } = this.props;
    return (
      <Media type="audio" {...props} />
    );
  }
}
