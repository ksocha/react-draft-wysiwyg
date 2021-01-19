import './styles.css';

import React, { Component } from 'react';
import classNames from 'classnames';
import { EditorState } from 'draft-js';
import PropTypes from 'prop-types';

import Option from '../../components/Option';

const getImageComponent = config =>
  class Image extends Component {
    static propTypes: {
      [key: string]: any;
    } = {
      block: PropTypes.object,
      contentState: PropTypes.object,
    };

    state: {
      [key: string]: any;
    } = {
      hovered: false,
    };

    setEntityAlignmentLeft: (...args: Array<any>) => any = (): void => {
      this.setEntityAlignment('left');
    };

    setEntityAlignmentRight: (...args: Array<any>) => any = (): void => {
      this.setEntityAlignment('right');
    };

    setEntityAlignmentCenter: (...args: Array<any>) => any = (): void => {
      this.setEntityAlignment('none');
    };

    setEntityAlignment: (...args: Array<any>) => any = (alignment): void => {
      const { block, contentState } = this.props;
      const entityKey = block.getEntityAt(0);
      contentState.mergeEntityData(entityKey, { alignment });
      config.onChange(EditorState.push(config.getEditorState(), contentState, 'change-block-data'));
      this.setState({
        dummy: true,
      });
    };

    toggleHovered: (...args: Array<any>) => any = (): void => {
      const hovered = !this.state.hovered;
      this.setState({
        hovered,
      });
    };

    renderAlignmentOptions(
      alignment
    ): {
      [key: string]: any;
    } {
      return (
        <div
          className={classNames('rdw-image-alignment-options-popup', {
            'rdw-image-alignment-options-popup-right': alignment === 'right',
          })}
        >
          <Option onClick={this.setEntityAlignmentLeft} className="rdw-image-alignment-option">
            L
          </Option>
          <Option onClick={this.setEntityAlignmentCenter} className="rdw-image-alignment-option">
            C
          </Option>
          <Option onClick={this.setEntityAlignmentRight} className="rdw-image-alignment-option">
            R
          </Option>
        </div>
      );
    }

    render(): {
      [key: string]: any;
    } {
      const { block, contentState } = this.props;
      const { hovered } = this.state;
      const { isReadOnly, isImageAlignmentEnabled } = config;
      const entity = contentState.getEntity(block.getEntityAt(0));
      const { src, alignment, height, width, alt } = entity.getData();

      return (
        <span
          onMouseEnter={this.toggleHovered}
          onMouseLeave={this.toggleHovered}
          className={classNames('rdw-image-alignment', {
            'rdw-image-left': alignment === 'left',
            'rdw-image-right': alignment === 'right',
            'rdw-image-center': !alignment || alignment === 'none',
          })}
        >
          <span className="rdw-image-imagewrapper">
            <img
              src={src}
              alt={alt}
              style={{
                height,
                width,
              }}
            />
            {!isReadOnly() && hovered && isImageAlignmentEnabled()
              ? this.renderAlignmentOptions(alignment)
              : undefined}
          </span>
        </span>
      );
    }
  };

export default getImageComponent;
