import './styles.css';

import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { EditorState, Modifier, RichUtils } from 'draft-js';
import { getSelectionInlineStyle } from 'draftjs-utils';

import boldIcon from '../../../images/bold.svg';
import italicIcon from '../../../images/italic.svg';
import monospaceIcon from '../../../images/monospace.svg';
import strikethroughIcon from '../../../images/strikethrough.svg';
import subscriptIcon from '../../../images/subscript.svg';
import superscriptIcon from '../../../images/superscript.svg';
import underlineIcon from '../../../images/underline.svg';
import Option from '../../components/Option';

enum InlineStyle {
  Bold = 'BOLD',
  Italic = 'ITALIC',
  Underline = 'UNDERLINE',
  Strikethrough = 'STRIKETHROUGH',
  Code = 'CODE',
  Superscript = 'SUPERSCRIPT',
  Subscript = 'SUBSCRIPT',
}

interface Props {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
}

export default function Inline({ onChange, editorState }: Props) {
  const intl = useIntl();

  const currentStyles = useMemo(() => getSelectionInlineStyle(editorState), [editorState]);

  const toggleInlineStyle = (newStyle: InlineStyle) => {
    let newState = RichUtils.toggleInlineStyle(editorState, newStyle);
    if (newStyle === InlineStyle.Subscript || newStyle === InlineStyle.Superscript) {
      const contentState = Modifier.removeInlineStyle(
        newState.getCurrentContent(),
        newState.getSelection(),
        newStyle === InlineStyle.Subscript ? InlineStyle.Superscript : InlineStyle.Subscript
      );
      newState = EditorState.push(newState, contentState, 'change-inline-style');
    }

    onChange(newState);
  };

  return (
    <div className="rdw-inline-wrapper" aria-label="rdw-inline-control">
      <Option
        value={InlineStyle.Bold}
        onClick={toggleInlineStyle}
        active={currentStyles[InlineStyle.Bold]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.bold' })}
      >
        <img alt="" src={boldIcon} />
      </Option>

      <Option
        value={InlineStyle.Italic}
        onClick={toggleInlineStyle}
        active={currentStyles[InlineStyle.Italic]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.italic' })}
      >
        <img alt="" src={italicIcon} />
      </Option>

      <Option
        value={InlineStyle.Underline}
        onClick={toggleInlineStyle}
        active={currentStyles[InlineStyle.Underline]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.underline' })}
      >
        <img alt="" src={underlineIcon} />
      </Option>

      <Option
        value={InlineStyle.Strikethrough}
        onClick={toggleInlineStyle}
        active={currentStyles[InlineStyle.Strikethrough]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.strikethrough' })}
      >
        <img alt="" src={strikethroughIcon} />
      </Option>

      <Option
        value={InlineStyle.Code}
        onClick={toggleInlineStyle}
        active={currentStyles[InlineStyle.Code]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.code' })}
      >
        <img alt="" src={monospaceIcon} />
      </Option>

      <Option
        value={InlineStyle.Superscript}
        onClick={toggleInlineStyle}
        active={currentStyles[InlineStyle.Superscript]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.superscript' })}
      >
        <img alt="" src={superscriptIcon} />
      </Option>

      <Option
        value={InlineStyle.Subscript}
        onClick={toggleInlineStyle}
        active={currentStyles[[InlineStyle.Subscript]]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.subscript' })}
      >
        <img alt="" src={subscriptIcon} />
      </Option>
    </div>
  );
}

// make subscript less low
