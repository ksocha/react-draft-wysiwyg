import './styles.css';

import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { EditorState, RichUtils } from 'draft-js';
import {
  changeDepth,
  getBlockBeforeSelectedBlock,
  getSelectedBlock,
  isListBlock,
} from 'draftjs-utils';

import indentIcon from '../../../images/indent.svg';
import orderedIcon from '../../../images/list-ordered.svg';
import unorderedIcon from '../../../images/list-unordered.svg';
import outdentIcon from '../../../images/outdent.svg';
import Option from '../../components/Option';

enum ListType {
  Ordered = 'ordered-list-item',
  Unordered = 'unordered-list-item',
}

enum IndentationChange {
  Indent = 'indent',
  Outdent = 'outdent',
}
interface Props {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
}

export default function List({ onChange, editorState }: Props) {
  const intl = useIntl();

  const currentBlock = useMemo(() => (editorState ? getSelectedBlock(editorState) : undefined), [
    editorState,
  ]);

  const indentDisabled = useMemo(() => {
    const previousBlock = getBlockBeforeSelectedBlock(editorState);

    if (
      !currentBlock ||
      !previousBlock ||
      !isListBlock(currentBlock) ||
      previousBlock.getType() !== currentBlock.getType() ||
      previousBlock.getDepth() < currentBlock.getDepth()
    ) {
      return true;
    }

    return false;
  }, [currentBlock, editorState]);

  const outdentDisabled = useMemo(() => {
    return !currentBlock || !isListBlock(currentBlock) || currentBlock.getDepth() <= 0;
  }, [currentBlock]);

  const currentListType = useMemo(() => currentBlock?.getType(), [currentBlock]);

  const handleListTypeChanged = (newType: ListType) => {
    onChange(RichUtils.toggleBlockType(editorState, newType));
  };

  const handleIndentationChange = (operationType: IndentationChange) => {
    onChange(changeDepth(editorState, operationType === IndentationChange.Indent ? 1 : -1, 4));
  };

  return (
    <div className="rdw-list-wrapper" aria-label="rdw-list-control">
      <Option
        value={ListType.Unordered}
        onClick={handleListTypeChanged}
        active={currentListType === ListType.Unordered}
        title={intl.formatMessage({ id: 'wysiwygEditor.list.unordered' })}
      >
        <img src={unorderedIcon} alt="" />
      </Option>

      <Option
        value={ListType.Ordered}
        onClick={handleListTypeChanged}
        active={currentListType === ListType.Ordered}
        title={intl.formatMessage({ id: 'wysiwygEditor.list.ordered' })}
      >
        <img src={orderedIcon} alt="" />
      </Option>

      <Option
        value={IndentationChange.Indent}
        onClick={handleIndentationChange}
        disabled={indentDisabled}
        title={intl.formatMessage({ id: 'wysiwygEditor.list.indent' })}
      >
        <img src={indentIcon} alt="" />
      </Option>

      <Option
        value={IndentationChange.Outdent}
        onClick={handleIndentationChange}
        disabled={outdentDisabled}
        title={intl.formatMessage({ id: 'wysiwygEditor.list.outdent' })}
      >
        <img src={outdentIcon} alt="" />
      </Option>
    </div>
  );
}
