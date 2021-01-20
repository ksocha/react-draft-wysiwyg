declare module 'draftjs-utils' {
  import { EditorState, ContentBlock } from 'draft-js';
  import { OrderedMap, List, Map } from 'immutable';

  export type InlineStyles = {
    BOLD?: boolean;
    ITALIC?: boolean;
    UNDERLINE?: boolean;
    STRIKETHROUGH?: boolean;
    CODE?: boolean;
    SUPERSCRIPT?: boolean;
    SUBSCRIPT?: boolean;
  };

  export function getSelectedBlocksMap(editorState: EditorState): OrderedMap;
  export function getSelectedBlocksList(editorState: EditorState): List;
  export function getSelectedBlock(editorState: EditorState): ContentBlock;
  export function getBlockBeforeSelectedBlock(editorState: EditorState): ContentBlock;
  export function getAllBlocks(editorState: EditorState): List;
  export function getSelectedBlocksType(editorState: EditorState): string;
  export function removeSelectedBlocksStyle(editorState: EditorState): EditorState;
  export function getSelectionText(editorState: EditorState): string;
  export function addLineBreakRemovingSelection(editorState: EditorState): EditorState;
  export function insertNewUnstyledBlock(editorState: EditorState): EditorState;
  export function clearEditorContent(editorState: EditorState): EditorState;
  export function getSelectionInlineStyle(editorState: EditorState): InlineStyles;
  export function setBlockData(
    editorState: EditorState,
    object: Record<string, unknown>
  ): EditorState;
  export function getSelectedBlocksMetadata(
    editorState: EditorState
  ): Map<string, string | undefined>;
  export function blockRenderMap(): Map;
  export function getSelectionEntity(editorState: EditorState): Entity;
  export function getEntityRange(
    editorState: EditorState,
    entityKey: string
  ): Record<string, unknown>;
  export function handleNewLine(editorState: EditorState): EditorState | Event;
  export function isListBlock(constentBlock: ContentBlock): boolean;
  export function changeDepth(editorState: EditorState, adjustment, maxDepth): EditorState;
  export function getSelectionCustomInlineStyle(
    editorState: EditorState,
    styles: string[]
  ): Record<string, string>;
  export function toggleCustomInlineStyle(
    editorState: EditorState,
    styleType: string,
    styleValue: string
  ): EditorState;
  export function removeAllInlineStyles(editorState: EditorState): EditorState;
}
