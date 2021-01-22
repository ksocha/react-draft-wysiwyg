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
import { ToolButton } from '../common/ToolButton';
import { ToolGroup } from '../common/ToolGroup';

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
    <ToolGroup aria-label="rdw-list-control">
      <ToolButton
        aria-pressed={currentListType === ListType.Unordered}
        onClick={() => handleListTypeChanged(ListType.Unordered)}
        title={intl.formatMessage({ id: 'wysiwygEditor.list.unordered' })}
      >
        <img src={unorderedIcon} alt="" />
      </ToolButton>

      <ToolButton
        aria-pressed={currentListType === ListType.Ordered}
        onClick={() => handleListTypeChanged(ListType.Ordered)}
        title={intl.formatMessage({ id: 'wysiwygEditor.list.ordered' })}
      >
        <img src={orderedIcon} alt="" />
      </ToolButton>

      <ToolButton
        disabled={indentDisabled}
        onClick={() => handleIndentationChange(IndentationChange.Indent)}
        title={intl.formatMessage({ id: 'wysiwygEditor.list.indent' })}
      >
        <img src={indentIcon} alt="" />
      </ToolButton>

      <ToolButton
        disabled={outdentDisabled}
        onClick={() => handleIndentationChange(IndentationChange.Outdent)}
        title={intl.formatMessage({ id: 'wysiwygEditor.list.outdent' })}
      >
        <img src={outdentIcon} alt="" />
      </ToolButton>
    </ToolGroup>
  );
}
