import './styles.css';

import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { EditorState } from 'draft-js';
import { getSelectedBlocksMetadata, setBlockData } from 'draftjs-utils';

import centerIcon from '../../../images/align-center.svg';
import justifyIcon from '../../../images/align-justify.svg';
import leftIcon from '../../../images/align-left.svg';
import rightIcon from '../../../images/align-right.svg';
import Option from '../../components/Option';

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
    <div className="rdw-text-align-wrapper" aria-label="rdw-textalign-control">
      <Option
        value={TextAlignment.Left}
        active={currentTextAlignment === TextAlignment.Left}
        onClick={addBlockAlignmentData}
        title={intl.formatMessage({ id: 'wysiwygEditor.textalign.left' })}
      >
        <img src={leftIcon} alt="" />
      </Option>

      <Option
        value={TextAlignment.Center}
        active={currentTextAlignment === TextAlignment.Center}
        onClick={addBlockAlignmentData}
        title={intl.formatMessage({ id: 'wysiwygEditor.textalign.center' })}
      >
        <img src={centerIcon} alt="" />
      </Option>

      <Option
        value={TextAlignment.Right}
        active={currentTextAlignment === TextAlignment.Right}
        onClick={addBlockAlignmentData}
        title={intl.formatMessage({ id: 'wysiwygEditor.textalign.right' })}
      >
        <img src={rightIcon} alt="" />
      </Option>

      <Option
        value={TextAlignment.Justify}
        active={currentTextAlignment === TextAlignment.Justify}
        onClick={addBlockAlignmentData}
        title={intl.formatMessage({ id: 'wysiwygEditor.textalign.justify' })}
      >
        <img src={justifyIcon} alt="" />
      </Option>
    </div>
  );
}
