import './styles.css';

import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Option from '../../../components/Option';
import { stopPropagation } from '../../../utils/common';

class LayoutComponent extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    config: PropTypes.object,
    translations: PropTypes.object,
  };

  onChange: (...args: Array<any>) => any = (event: { [key: string]: any }): void => {
    const { onChange } = this.props;
    onChange(event.target.innerHTML);
  };

  renderEmojiModal() {
    const {
      config: { popupClassName, emojis },
    } = this.props;
    return (
      <div className={classNames('rdw-emoji-modal', popupClassName)} onClick={stopPropagation}>
        {emojis.map((emoji, index) => (
          <span key={index} className="rdw-emoji-icon" alt="" onClick={this.onChange}>
            {emoji}
          </span>
        ))}
      </div>
    );
  }

  render() {
    const {
      config: { icon, className, title },
      expanded,
      onExpandEvent,
      translations,
    } = this.props;
    return (
      <div
        className="rdw-emoji-wrapper"
        aria-haspopup="true"
        aria-label="rdw-emoji-control"
        aria-expanded={expanded}
        title={title || translations['components.controls.emoji.emoji']}
      >
        <Option
          className={classNames(className)}
          value="unordered-list-item"
          onClick={onExpandEvent}
        >
          <img src={icon} alt="" />
        </Option>
        {expanded ? this.renderEmojiModal() : undefined}
      </div>
    );
  }
}

export default LayoutComponent;
