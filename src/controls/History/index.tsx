import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { EditorState } from 'draft-js';

import redoIcon from '../../../images/redo.svg';
import undoIcon from '../../../images/undo.svg';
import { ToolButton } from '../common/ToolButton';
import { ToolGroup } from '../common/ToolGroup';

interface Props {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
}

export default function History({ editorState, onChange }: Props) {
  const intl = useIntl();

  const undoDisabled = useMemo(() => editorState.getUndoStack().size === 0, [editorState]);

  const handleUndo = useCallback(() => {
    onChange(EditorState.undo(editorState));
  }, [editorState, onChange]);

  const redoDisabled = useMemo(() => editorState.getRedoStack().size === 0, [editorState]);

  const handleRedo = useCallback(() => {
    onChange(EditorState.redo(editorState));
  }, [editorState, onChange]);

  return (
    <ToolGroup aria-label="rdw-history-control">
      <ToolButton
        onClick={handleUndo}
        disabled={undoDisabled}
        title={intl.formatMessage({ id: 'wysiwygEditor.history.undo' })}
      >
        <img src={undoIcon} alt="" />
      </ToolButton>

      <ToolButton
        onClick={handleRedo}
        disabled={redoDisabled}
        title={intl.formatMessage({ id: 'wysiwygEditor.history.redo' })}
      >
        <img src={redoIcon} alt="" />
      </ToolButton>
    </ToolGroup>
  );
}
