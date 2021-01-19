import './styles.css';

import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default class Option extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.any,
    value: PropTypes.string,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.string,
  };

  static defaultProps = {
    activeClassName: '',
  };

  onClick: (...args: Array<any>) => any = () => {
    const { disabled, onClick, value } = this.props;
    if (!disabled) {
      onClick(value);
    }
  };

  render() {
    const { children, className, activeClassName, active, disabled, title } = this.props;
    return (
      <div
        className={classNames('rdw-option-wrapper', className, {
          [`rdw-option-active ${activeClassName}`]: active,
          'rdw-option-disabled': disabled,
        })}
        onClick={this.onClick}
        aria-selected={active}
        title={title}
      >
        {children}
      </div>
    );
  }
}
