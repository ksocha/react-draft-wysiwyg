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
  export function getBlockBeforeSelectedBlock(editorState: EditorState): ContentBlock | undefined;
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
  export function getSelectionEntity(editorState: EditorState): string | undefined;
  export function getEntityRange(
    editorState: EditorState,
    entityKey: string
  ): {
    start: number | undefined;
    end: number | undefined;
    text: string;
  };
  export function handleNewLine(editorState: EditorState): EditorState | Event;
  export function isListBlock(constentBlock: ContentBlock): boolean;
  export function changeDepth(editorState: EditorState, adjustment, maxDepth): EditorState;
  export function getSelectionCustomInlineStyle(
    editorState: EditorState,
    styles: string[]
  ): Record<string, string>;
  export function getCustomStyleMap(): Record<string, string>;
  export function toggleCustomInlineStyle(
    editorState: EditorState,
    styleType: string,
    styleValue: string
  ): EditorState;
  export function extractInlineStyle(editorState: EditorState): void;
  export function removeAllInlineStyles(editorState: EditorState): EditorState;
}
