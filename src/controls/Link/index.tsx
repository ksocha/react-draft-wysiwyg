import './styles.css';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { usePopper } from 'react-popper';
import { EditorState, Modifier, RichUtils } from 'draft-js';
import { getEntityRange, getSelectionEntity, getSelectionText } from 'draftjs-utils';
import linkifyIt from 'linkify-it';

import linkIcon from '../../../images/link.svg';
import unlinkIcon from '../../../images/unlink.svg';
import { ToolButton } from '../common/ToolButton';
import { ToolGroup } from '../common/ToolGroup';
import { AddLinkModal, Props as AddLinkModalProps } from './AddLinkModal';

const linkify = linkifyIt();
const linkifyLink = (params: { title: string; target: string; targetOption: string }) => {
  const links = linkify.match(params.target);
  return {
    ...params,
    target: (links && links[0] && links[0].url) || params.target,
  };
};

interface Props {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
}

export default function Link({ onChange, editorState }: Props) {
  const intl = useIntl();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);

  const closeModal = () => setShowModal(false);

  const currentEntityKey = useMemo(
    () => (editorState ? getSelectionEntity(editorState) : undefined),
    [editorState]
  );

  const selectionText = useMemo(() => {
    return getSelectionText(editorState);
  }, [editorState]);

  const link = useMemo(() => {
    const contentState = editorState.getCurrentContent();
    const entity = currentEntityKey ? contentState.getEntity(currentEntityKey) : undefined;

    if (entity?.getType() === 'LINK') {
      const entityRange = currentEntityKey
        ? getEntityRange(editorState, currentEntityKey)
        : undefined;

      return {
        title: entityRange?.text,
        target: entity.getData().url as string,
        targetOption: entity.getData().targetOption as string,
      };
    }

    return undefined;
  }, [currentEntityKey, editorState]);

  const removeLink = useCallback(() => {
    let selection = editorState.getSelection();
    if (currentEntityKey) {
      const entityRange = getEntityRange(editorState, currentEntityKey);
      const isBackward = selection.getIsBackward();
      if (isBackward) {
        selection = selection.merge({
          anchorOffset: entityRange.end,
          focusOffset: entityRange.start,
        });
      } else {
        selection = selection.merge({
          anchorOffset: entityRange.start,
          focusOffset: entityRange.end,
        });
      }
      onChange(RichUtils.toggleLink(editorState, selection, null));
    }
  }, [currentEntityKey, editorState, onChange]);

  const addLink = useCallback<AddLinkModalProps['onSubmit']>(
    values => {
      const { title, target, targetOption } = linkifyLink({
        title: values.title,
        target: values.target,
        targetOption: values.openInNewWindow ? '_blank' : '_self',
      });

      let selection = editorState.getSelection();

      if (currentEntityKey) {
        const entityRange = getEntityRange(editorState, currentEntityKey);
        const isBackward = selection.getIsBackward();
        if (isBackward) {
          selection = selection.merge({
            anchorOffset: entityRange.end,
            focusOffset: entityRange.start,
          });
        } else {
          selection = selection.merge({
            anchorOffset: entityRange.start,
            focusOffset: entityRange.end,
          });
        }
      }

      const entityKey = editorState
        .getCurrentContent()
        .createEntity('LINK', 'MUTABLE', {
          url: target,
          targetOption,
        })
        .getLastCreatedEntityKey();

      let contentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        selection,
        title,
        editorState.getCurrentInlineStyle(),
        entityKey
      );
      let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');

      // insert a blank space after link
      selection = newEditorState.getSelection().merge({
        anchorOffset: selection.get('anchorOffset') + title.length,
        focusOffset: selection.get('anchorOffset') + title.length,
      });
      newEditorState = EditorState.acceptSelection(newEditorState, selection);
      contentState = Modifier.insertText(
        newEditorState.getCurrentContent(),
        selection,
        ' ',
        newEditorState.getCurrentInlineStyle(),
        undefined
      );
      onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
      closeModal();
    },
    [currentEntityKey, editorState, onChange]
  );

  const referenceElementRef = useRef(null);
  const popperElementRef = useRef(null);

  const { styles, attributes } = usePopper(referenceElementRef.current, popperElementRef.current, {
    modifiers: [
      { name: 'preventOverflow', enabled: false },
      { name: 'hide', enabled: false },
    ],
    placement: 'bottom-start',
  });

  return (
    <ToolGroup aria-label="rdw-link-control" ref={referenceElementRef}>
      <ToolButton
        onClick={openModal}
        aria-haspopup="dialog"
        title={intl.formatMessage({ id: 'wysiwygEditor.link.link' })}
      >
        <img src={linkIcon} alt="" />
      </ToolButton>

      <ToolButton
        disabled={!link}
        onClick={removeLink}
        title={intl.formatMessage({ id: 'wysiwygEditor.link.unlink' })}
      >
        <img src={unlinkIcon} alt="" />
      </ToolButton>

      <AddLinkModal
        ref={popperElementRef}
        style={styles.popper}
        {...attributes.popper}
        isOpen={showModal}
        onSubmit={addLink}
        onCancel={closeModal}
        initialValues={{
          title: link?.title || selectionText || '',
          target: link?.target || '',
          openInNewWindow: link?.targetOption === '_blank',
        }}
      />
    </ToolGroup>
  );
}
