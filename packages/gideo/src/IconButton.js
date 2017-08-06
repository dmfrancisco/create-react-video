import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from './Icon';

const Button = styled.button`
  background: none;
  border: none;
  color: inherit;
  line-height: 0;
  outline: none;
  vertical-align: middle;
`;

export default class IconButton extends Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    large: PropTypes.bool,
  }

  static defaultProps = {
    onClick() {},
    large: false,
  }

  render() {
    return (
      <Button onClick={this.props.onClick}>
        <Icon
          icon={this.props.icon}
          large={this.props.large}
        />
      </Button>
    );
  }
}
