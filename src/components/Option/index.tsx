import './styles.css';

import React, { Component } from 'react';
import classNames from 'classnames';

interface Props {
  onClick: (value: string) => void;
  children: React.ReactNode;
  value: string;
  className?: string;
  activeClassName?: string;
  active?: boolean;
  disabled?: boolean;
  title: string;
}

export default class Option extends Component<Props> {
  static defaultProps = {
    activeClassName: '',
  };

  onClick = () => {
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
