import './styles.css';

import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { EditorState, Modifier, RichUtils } from 'draft-js';
import { getSelectionInlineStyle, InlineStyles } from 'draftjs-utils';

import boldIcon from '../../../images/bold.svg';
import italicIcon from '../../../images/italic.svg';
import monospaceIcon from '../../../images/monospace.svg';
import strikethroughIcon from '../../../images/strikethrough.svg';
import subscriptIcon from '../../../images/subscript.svg';
import superscriptIcon from '../../../images/superscript.svg';
import underlineIcon from '../../../images/underline.svg';
import Option from '../../components/Option';

interface Props {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
}

export default function Inline({ onChange, editorState }: Props) {
  const intl = useIntl();

  const currentStyles = useMemo(() => getSelectionInlineStyle(editorState), [editorState]);

  const toggleInlineStyle = (newStyle: keyof InlineStyles) => {
    let newState = RichUtils.toggleInlineStyle(editorState, newStyle);
    if (newStyle === 'SUBSCRIPT' || newStyle === 'SUPERSCRIPT') {
      const contentState = Modifier.removeInlineStyle(
        newState.getCurrentContent(),
        newState.getSelection(),
        newStyle === 'SUBSCRIPT' ? 'SUPERSCRIPT' : 'SUBSCRIPT'
      );
      newState = EditorState.push(newState, contentState, 'change-inline-style');
    }

    onChange(newState);
  };

  return (
    <div className="rdw-inline-wrapper" aria-label="rdw-inline-control">
      <Option
        value="BOLD"
        onClick={toggleInlineStyle}
        active={currentStyles.BOLD}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.bold' })}
      >
        <img alt="" src={boldIcon} />
      </Option>

      <Option
        value="ITALIC"
        onClick={toggleInlineStyle}
        active={currentStyles.ITALIC}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.italic' })}
      >
        <img alt="" src={italicIcon} />
      </Option>

      <Option
        value="UNDERLINE"
        onClick={toggleInlineStyle}
        active={currentStyles.UNDERLINE}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.underline' })}
      >
        <img alt="" src={underlineIcon} />
      </Option>

      <Option
        value="STRIKETHROUGH"
        onClick={toggleInlineStyle}
        active={currentStyles.STRIKETHROUGH}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.strikethrough' })}
      >
        <img alt="" src={strikethroughIcon} />
      </Option>

      <Option
        value="CODE"
        onClick={toggleInlineStyle}
        active={currentStyles.CODE}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.code' })}
      >
        <img alt="" src={monospaceIcon} />
      </Option>

      <Option
        value="SUPERSCRIPT"
        onClick={toggleInlineStyle}
        active={currentStyles.SUPERSCRIPT}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.superscript' })}
      >
        <img alt="" src={superscriptIcon} />
      </Option>

      <Option
        value="SUBSCRIPT"
        onClick={toggleInlineStyle}
        active={currentStyles.SUBSCRIPT}
        title={intl.formatMessage({ id: 'wysiwygEditor.inline.subscript' })}
      >
        <img alt="" src={subscriptIcon} />
      </Option>
    </div>
  );
}

// make subscript less low
