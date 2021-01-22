import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { EditorState, Modifier } from 'draft-js';
import { getSelectionCustomInlineStyle } from 'draftjs-utils';
import { forEach } from 'lodash';

import eraserIcon from '../../../images/eraser.svg';
import { ToolButton } from '../common/ToolButton';
import { ToolGroup } from '../common/ToolGroup';

interface Props {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
}

export default function Remove({ onChange, editorState }: Props) {
  const intl = useIntl();

  const removeInlineStyles = useCallback(() => {
    let contentState = editorState.getCurrentContent();

    ['BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH', 'CODE', 'SUPERSCRIPT', 'SUBSCRIPT'].forEach(
      style => {
        contentState = Modifier.removeInlineStyle(contentState, editorState.getSelection(), style);
      }
    );

    const customStyles = getSelectionCustomInlineStyle(editorState, [
      'FONTSIZE',
      'FONTFAMILY',
      'COLOR',
      'BGCOLOR',
    ]);

    forEach(customStyles, value => {
      if (value) {
        contentState = Modifier.removeInlineStyle(contentState, editorState.getSelection(), value);
      }
    });

    const newState = EditorState.push(editorState, contentState, 'change-inline-style');

    onChange(newState);
  }, [onChange, editorState]);

  return (
    <ToolGroup aria-label="rdw-remove-control">
      <ToolButton
        onClick={removeInlineStyles}
        title={intl.formatMessage({ id: 'wysiwygEditor.remove' })}
      >
        <img src={eraserIcon} alt="" />
      </ToolButton>
    </ToolGroup>
  );
}
