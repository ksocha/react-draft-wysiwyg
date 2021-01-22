import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import { EditorState, Modifier } from 'draft-js';

import emojiIcon from '../../../images/emoji.svg';
import { ToolButton } from '../common/ToolButton';
import { ToolGroup } from '../common/ToolGroup';
import useToolModal from '../common/useToolModal';
import { EmojiModal } from './EmojiModal';

interface Props {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
}

export default function Emoji({ onChange, editorState }: Props) {
  const intl = useIntl();
  const referenceElementRef = useRef(null);
  const popperElementRef = useRef(null);
  const { styles, attributes, closeModal, toggleModal, isModalOpen } = useToolModal(
    referenceElementRef.current,
    popperElementRef.current
  );

  const addEmoji = (emoji: string) => {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      emoji,
      editorState.getCurrentInlineStyle()
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    closeModal();
  };

  return (
    <ToolGroup aria-label="rdw-emoji-control" ref={referenceElementRef}>
      <ToolButton
        aria-haspopup="dialog"
        aria-pressed={isModalOpen}
        title={intl.formatMessage({ id: 'wysiwygEditor.emoji.title' })}
        onClick={toggleModal}
      >
        <img src={emojiIcon} alt="" />
      </ToolButton>

      <EmojiModal
        ref={popperElementRef}
        style={styles.popper}
        {...attributes.popper}
        isOpen={isModalOpen}
        onSubmit={addEmoji}
        onCancel={closeModal}
      />
    </ToolGroup>
  );
}
