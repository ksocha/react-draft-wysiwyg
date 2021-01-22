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
import { ToolButton } from '../common/ToolButton';
import { ToolGroup } from '../common/ToolGroup';

enum InlineStyle {
  Bold = 'BOLD',
  Italic = 'ITALIC',
  Underline = 'UNDERLINE',
  Strikethrough = 'STRIKETHROUGH',
  Code = 'CODE',
  Superscript = 'SUPERSCRIPT',
  Subscript = 'SUBSCRIPT',
}

function applyInlineStyle(editorState: EditorState, style: InlineStyle): EditorState {
  const newState = RichUtils.toggleInlineStyle(editorState, style);

  if (style === InlineStyle.Subscript || style === InlineStyle.Superscript) {
    return EditorState.push(
      newState,
      Modifier.removeInlineStyle(
        newState.getCurrentContent(),
        newState.getSelection(),
        style === InlineStyle.Subscript ? InlineStyle.Superscript : InlineStyle.Subscript
      ),
      'change-inline-style'
    );
  }

  return newState;
}

interface Props {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
}

export default function Inline({ onChange, editorState }: Props) {
  const intl = useIntl();

  const currentStyles = useMemo(() => getSelectionInlineStyle(editorState), [editorState]);

  const toggleInlineStyle = (newStyle: InlineStyle) => {
    onChange(applyInlineStyle(editorState, newStyle));
  };

  return (
    <ToolGroup aria-label="rdw-inline-control">
      <ToolButton
        onClick={() => toggleInlineStyle(InlineStyle.Bold)}
        aria-pressed={currentStyles[InlineStyle.Bold]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.bold' })}
      >
        <img alt="" src={boldIcon} />
      </ToolButton>

      <ToolButton
        onClick={() => toggleInlineStyle(InlineStyle.Italic)}
        aria-pressed={currentStyles[InlineStyle.Italic]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.italic' })}
      >
        <img alt="" src={italicIcon} />
      </ToolButton>

      <ToolButton
        onClick={() => toggleInlineStyle(InlineStyle.Underline)}
        aria-pressed={currentStyles[InlineStyle.Underline]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.underline' })}
      >
        <img alt="" src={underlineIcon} />
      </ToolButton>

      <ToolButton
        onClick={() => toggleInlineStyle(InlineStyle.Strikethrough)}
        aria-pressed={currentStyles[InlineStyle.Strikethrough]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.strikethrough' })}
      >
        <img alt="" src={strikethroughIcon} />
      </ToolButton>

      <ToolButton
        onClick={() => toggleInlineStyle(InlineStyle.Code)}
        aria-pressed={currentStyles[InlineStyle.Code]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.code' })}
      >
        <img alt="" src={monospaceIcon} />
      </ToolButton>

      <ToolButton
        onClick={() => toggleInlineStyle(InlineStyle.Superscript)}
        aria-pressed={currentStyles[InlineStyle.Superscript]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.superscript' })}
      >
        <img alt="" src={superscriptIcon} />
      </ToolButton>

      <ToolButton
        onClick={() => toggleInlineStyle(InlineStyle.Subscript)}
        aria-pressed={currentStyles[InlineStyle.Subscript]}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.subscript' })}
      >
        <img alt="" src={subscriptIcon} />
      </ToolButton>
    </ToolGroup>
  );
}
