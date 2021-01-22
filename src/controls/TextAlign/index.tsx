import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { EditorState } from 'draft-js';
import { getSelectedBlocksMetadata, setBlockData } from 'draftjs-utils';

import centerIcon from '../../../images/align-center.svg';
import justifyIcon from '../../../images/align-justify.svg';
import leftIcon from '../../../images/align-left.svg';
import rightIcon from '../../../images/align-right.svg';
import { ToolButton } from '../common/ToolButton';
import { ToolGroup } from '../common/ToolGroup';

enum TextAlignment {
  Left = 'left',
  Right = 'right',
  Center = 'center',
  Justify = 'justify',
}

interface Props {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
}

export default function TextAlign({ onChange, editorState }: Props) {
  const intl = useIntl();

  const currentTextAlignment = useMemo(
    () => getSelectedBlocksMetadata(editorState).get('text-align'),
    [editorState]
  );

  const addBlockAlignmentData = (value: TextAlignment) => {
    onChange(
      setBlockData(editorState, {
        'text-align': currentTextAlignment !== value ? value : undefined,
      })
    );
  };

  return (
    <ToolGroup aria-label="rdw-textalign-control">
      <ToolButton
        aria-pressed={currentTextAlignment === TextAlignment.Left}
        onClick={() => addBlockAlignmentData(TextAlignment.Left)}
        title={intl.formatMessage({ id: 'wysiwygEditor.textalign.left' })}
      >
        <img src={leftIcon} alt="" />
      </ToolButton>

      <ToolButton
        aria-pressed={currentTextAlignment === TextAlignment.Center}
        onClick={() => addBlockAlignmentData(TextAlignment.Center)}
        title={intl.formatMessage({ id: 'wysiwygEditor.textalign.center' })}
      >
        <img src={centerIcon} alt="" />
      </ToolButton>

      <ToolButton
        aria-pressed={currentTextAlignment === TextAlignment.Right}
        onClick={() => addBlockAlignmentData(TextAlignment.Right)}
        title={intl.formatMessage({ id: 'wysiwygEditor.textalign.right' })}
      >
        <img src={rightIcon} alt="" />
      </ToolButton>

      <ToolButton
        aria-pressed={currentTextAlignment === TextAlignment.Justify}
        onClick={() => addBlockAlignmentData(TextAlignment.Justify)}
        title={intl.formatMessage({ id: 'wysiwygEditor.textalign.justify' })}
      >
        <img src={justifyIcon} alt="" />
      </ToolButton>
    </ToolGroup>
  );
}
