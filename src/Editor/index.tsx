import './styles.css';
import 'draft-js/dist/Draft.css';

import React, { Component, KeyboardEvent, SyntheticEvent } from 'react';
import classNames from 'classnames';
import {
  CompositeDecorator,
  ContentBlock,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  RawDraftContentState,
  RichUtils,
} from 'draft-js';
import {
  blockRenderMap,
  changeDepth,
  extractInlineStyle,
  getCustomStyleMap,
  getSelectedBlocksType,
  handleNewLine,
} from 'draftjs-utils';

import defaultToolbar from '../config/defaultToolbar';
import Controls from '../controls';
import getLinkDecorator from '../decorators/Link';
import FocusHandler from '../event-handler/focus';
import KeyDownHandler from '../event-handler/keyDown';
import ModalHandler from '../event-handler/modals';
import SuggestionHandler from '../event-handler/suggestions';
import translations from '../i18n';
import getBlockRenderFunc from '../renderer';
import { filter, hasProperty } from '../utils/common';
import { handlePastedText } from '../utils/handlePaste';
import { mergeRecursive } from '../utils/toolbar';

function blockStyleFn(block: ContentBlock): string {
  const blockAlignment = block.getData().get('text-align');
  if (blockAlignment) {
    return `rdw-${blockAlignment}-aligned-block`;
  }

  return '';
}

export interface Props {
  onChange?(contentState: RawDraftContentState): void;
  onEditorStateChange?(editorState: EditorState): void;
  onContentStateChange?(contentState: RawDraftContentState): void;
  initialContentState?: RawDraftContentState;
  defaultContentState?: RawDraftContentState;
  contentState?: RawDraftContentState;
  editorState?: EditorState;
  defaultEditorState?: EditorState;
  toolbarOnFocus?: boolean;
  spellCheck?: boolean;
  stripPastedStyles?: boolean;
  toolbar?: object;
  toolbarClassName?: string;
  toolbarHidden?: boolean;
  wrapperClassName?: string;
  toolbarStyle?: object;
  editorStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  uploadCallback?(file: object): Promise<object>;
  onFocus?(event: SyntheticEvent): void;
  onBlur?(event: SyntheticEvent): void;
  onTab?(event: KeyboardEvent): boolean | void;
  textAlignment?: string;
  readOnly?: boolean;
  tabIndex?: number;
  placeholder?: string;
  ariaLabel?: string;
  ariaOwneeID?: string;
  ariaActiveDescendantID?: string;
  ariaAutoComplete?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: string;
  ariaHasPopup?: string;
  wrapperId?: number;
  editorRef?(ref: object): void;
  handlePastedText?(
    text: string,
    html: string,
    editorState: EditorState,
    onChange: (editorState: EditorState) => void
  ): boolean;
  customStyleMap?: object;
}

export default class WysiwygEditor extends Component<Props> {
  static defaultProps = {
    toolbarOnFocus: false,
    toolbarHidden: false,
    stripPastedStyles: false,
  };

  private modalHandler = new ModalHandler();

  private focusHandler = new FocusHandler();

  private compositeDecorator: CompositeDecorator | null;

  constructor(props: Props) {
    super(props);
    const toolbar = mergeRecursive(defaultToolbar, props.toolbar);
    const wrapperId = props.wrapperId || Math.floor(Math.random() * 10000);
    this.wrapperId = `rdw-wrapper-${wrapperId}`;

    this.blockRendererFn = getBlockRenderFunc({
      isReadOnly: () => props.readOnly,
      isImageAlignmentEnabled: this.isImageAlignmentEnabled,
      getEditorState: this.getEditorState,
      onChange: this.onChange,
    });
    this.editorProps = this.filterEditorProps(props);
    this.customStyleMap = this.getStyleMap(props);
    this.compositeDecorator = new CompositeDecorator([
      getLinkDecorator({
        showOpenOptionOnHover: toolbar.link.showOpenOptionOnHover,
      }),
    ]);
    const editorState = this.createEditorState(this.compositeDecorator);
    extractInlineStyle(editorState);
    this.state = {
      editorState,
      editorFocused: false,
      toolbar,
    };
  }

  componentDidMount() {
    this.modalHandler.init(this.wrapperId);
  }
  // todo: change decorators depending on properties recceived in componentWillReceiveProps.

  componentDidUpdate(prevProps: Props) {
    if (prevProps === this.props) return;
    const newState = {};
    const { editorState, contentState } = this.props;
    if (!this.state.toolbar) {
      const toolbar = mergeRecursive(defaultToolbar, toolbar);
      newState.toolbar = toolbar;
    }
    if (hasProperty(this.props, 'editorState') && editorState !== prevProps.editorState) {
      if (editorState) {
        newState.editorState = EditorState.set(editorState, {
          decorator: this.compositeDecorator,
        });
      } else {
        newState.editorState = EditorState.createEmpty(this.compositeDecorator);
      }
    } else if (hasProperty(this.props, 'contentState') && contentState !== prevProps.contentState) {
      if (contentState) {
        const newEditorState = this.changeEditorState(contentState);
        if (newEditorState) {
          newState.editorState = newEditorState;
        }
      } else {
        newState.editorState = EditorState.createEmpty(this.compositeDecorator);
      }
    }
    if (prevProps.editorState !== editorState || prevProps.contentState !== contentState) {
      extractInlineStyle(newState.editorState);
    }
    if (Object.keys(newState).length) this.setState(newState);
    this.editorProps = this.filterEditorProps(this.props);
    this.customStyleMap = this.getStyleMap(this.props);
  }

  onEditorBlur = () => {
    this.setState({
      editorFocused: false,
    });
  };

  onEditorFocus = event => {
    const { onFocus } = this.props;
    this.setState({
      editorFocused: true,
    });
    const editFocused = this.focusHandler.isEditorFocused();
    if (onFocus && editFocused) {
      onFocus(event);
    }
  };

  onEditorMouseDown = () => {
    this.focusHandler.onEditorMouseDown();
  };

  keyBindingFn = event => {
    if (event.key === 'Tab') {
      const { onTab } = this.props;
      if (!onTab || !onTab(event)) {
        const editorState = changeDepth(this.state.editorState, event.shiftKey ? -1 : 1, 4);
        if (editorState && editorState !== this.state.editorState) {
          this.onChange(editorState);
          event.preventDefault();
        }
      }
      return null;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      if (SuggestionHandler.isOpen()) {
        event.preventDefault();
      }
    }
    return getDefaultKeyBinding(event);
  };

  onToolbarFocus = event => {
    const { onFocus } = this.props;
    if (onFocus && this.focusHandler.isToolbarFocused()) {
      onFocus(event);
    }
  };

  onWrapperBlur = event => {
    const { onBlur } = this.props;
    if (onBlur && this.focusHandler.isEditorBlur(event)) {
      onBlur(event, this.getEditorState());
    }
  };

  onChange = editorState => {
    const { readOnly, onEditorStateChange } = this.props;
    if (
      !readOnly &&
      !(getSelectedBlocksType(editorState) === 'atomic' && editorState.getSelection().isCollapsed)
    ) {
      if (onEditorStateChange) {
        onEditorStateChange(editorState, this.props.wrapperId);
      }
      if (!hasProperty(this.props, 'editorState')) {
        this.setState({ editorState }, this.afterChange(editorState));
      } else {
        this.afterChange(editorState);
      }
    }
  };

  setWrapperReference = ref => {
    this.wrapper = ref;
  };

  setEditorReference = ref => {
    if (this.props.editorRef) {
      this.props.editorRef(ref);
    }
    this.editor = ref;
  };

  getWrapperRef = () => this.wrapper;

  getEditorState = () => (this.state ? this.state.editorState : null);

  afterChange = editorState => {
    setTimeout(() => {
      const { onChange, onContentStateChange } = this.props;
      if (onChange) {
        onChange(convertToRaw(editorState.getCurrentContent()));
      }
      if (onContentStateChange) {
        onContentStateChange(convertToRaw(editorState.getCurrentContent()));
      }
    });
  };

  isImageAlignmentEnabled = () => this.state.toolbar.image.alignmentEnabled;

  createEditorState = compositeDecorator => {
    let editorState;
    if (hasProperty(this.props, 'editorState')) {
      if (this.props.editorState) {
        editorState = EditorState.set(this.props.editorState, {
          decorator: compositeDecorator,
        });
      }
    } else if (hasProperty(this.props, 'defaultEditorState')) {
      if (this.props.defaultEditorState) {
        editorState = EditorState.set(this.props.defaultEditorState, {
          decorator: compositeDecorator,
        });
      }
    } else if (hasProperty(this.props, 'contentState')) {
      if (this.props.contentState) {
        const contentState = convertFromRaw(this.props.contentState);
        editorState = EditorState.createWithContent(contentState, compositeDecorator);
        editorState = EditorState.moveSelectionToEnd(editorState);
      }
    } else if (
      hasProperty(this.props, 'defaultContentState') ||
      hasProperty(this.props, 'initialContentState')
    ) {
      let contentState = this.props.defaultContentState || this.props.initialContentState;
      if (contentState) {
        contentState = convertFromRaw(contentState);
        editorState = EditorState.createWithContent(contentState, compositeDecorator);
        editorState = EditorState.moveSelectionToEnd(editorState);
      }
    }
    if (!editorState) {
      editorState = EditorState.createEmpty(compositeDecorator);
    }
    return editorState;
  };

  filterEditorProps = props =>
    filter(props, [
      'onChange',
      'onEditorStateChange',
      'onContentStateChange',
      'initialContentState',
      'defaultContentState',
      'contentState',
      'editorState',
      'defaultEditorState',
      'toolbarOnFocus',
      'toolbar',
      'toolbarClassName',
      'toolbarHidden',
      'wrapperClassName',
      'toolbarStyle',
      'editorStyle',
      'wrapperStyle',
      'uploadCallback',
      'onFocus',
      'onBlur',
      'onTab',
      'ariaLabel',
      'handlePastedText',
      'customStyleMap',
    ]);

  getStyleMap = props => ({ ...getCustomStyleMap(), ...props.customStyleMap });

  changeEditorState = contentState => {
    const newContentState = convertFromRaw(contentState);
    let { editorState } = this.state;
    editorState = EditorState.push(editorState, newContentState, 'insert-characters');
    editorState = EditorState.moveSelectionToEnd(editorState);
    return editorState;
  };

  focusEditor = () => {
    setTimeout(() => {
      this.editor.focus();
    });
  };

  handleKeyCommand = command => {
    const {
      editorState,
      toolbar: { inline },
    } = this.state;
    if (inline && inline.options.indexOf(command) >= 0) {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.onChange(newState);
        return true;
      }
    }
    return false;
  };

  handleReturn = event => {
    if (SuggestionHandler.isOpen()) {
      return true;
    }
    const { editorState } = this.state;
    const newEditorState = handleNewLine(editorState, event);
    if (newEditorState) {
      this.onChange(newEditorState);
      return true;
    }
    return false;
  };

  handlePastedTextFn = (text, html) => {
    const { editorState } = this.state;
    const { handlePastedText: handlePastedTextProp, stripPastedStyles } = this.props;

    if (handlePastedTextProp) {
      return handlePastedTextProp(text, html, editorState, this.onChange);
    }
    if (!stripPastedStyles) {
      return handlePastedText(text, html, editorState, this.onChange);
    }
    return false;
  };

  preventDefault = event => {
    if (
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'LABEL' ||
      event.target.tagName === 'TEXTAREA'
    ) {
      this.focusHandler.onInputMouseDown();
    } else {
      event.preventDefault();
    }
  };

  render() {
    const { editorState, editorFocused, toolbar } = this.state;
    const {
      toolbarOnFocus,
      toolbarClassName,
      toolbarHidden,
      wrapperClassName,
      toolbarStyle,
      editorStyle,
      wrapperStyle,
      uploadCallback,
      ariaLabel,
    } = this.props;

    const controlProps = {
      modalHandler: this.modalHandler,
      editorState,
      onChange: this.onChange,
      translations,
    };
    const toolbarShow = editorFocused || this.focusHandler.isInputFocused() || !toolbarOnFocus;
    return (
      <div
        id={this.wrapperId}
        className={classNames(wrapperClassName, 'rdw-editor-wrapper')}
        style={wrapperStyle}
        onClick={this.modalHandler.onEditorClick}
        onBlur={this.onWrapperBlur}
        aria-label="rdw-wrapper"
      >
        {!toolbarHidden && (
          <div
            className={classNames('rdw-editor-toolbar', toolbarClassName)}
            style={{
              visibility: toolbarShow ? 'visible' : 'hidden',
              ...toolbarStyle,
            }}
            onMouseDown={this.preventDefault}
            aria-label="rdw-toolbar"
            aria-hidden={!editorFocused && toolbarOnFocus}
            onFocus={this.onToolbarFocus}
          >
            {toolbar.options.map((opt, index) => {
              const Control = Controls[opt];
              const config = toolbar[opt];
              if (opt === 'image' && uploadCallback) {
                config.uploadCallback = uploadCallback;
              }
              return <Control key={index} {...controlProps} config={config} />;
            })}
          </div>
        )}
        <div
          ref={this.setWrapperReference}
          className="rdw-editor-main"
          style={editorStyle}
          onClick={this.focusEditor}
          onFocus={this.onEditorFocus}
          onBlur={this.onEditorBlur}
          onKeyDown={KeyDownHandler.onKeyDown}
          onMouseDown={this.onEditorMouseDown}
        >
          <Editor
            ref={this.setEditorReference}
            keyBindingFn={this.keyBindingFn}
            editorState={editorState}
            onChange={this.onChange}
            blockStyleFn={blockStyleFn}
            customStyleMap={this.getStyleMap(this.props)}
            handleReturn={this.handleReturn}
            handlePastedText={this.handlePastedTextFn}
            blockRendererFn={this.blockRendererFn}
            handleKeyCommand={this.handleKeyCommand}
            ariaLabel={ariaLabel || 'rdw-editor'}
            blockRenderMap={blockRenderMap}
            {...this.editorProps}
          />
        </div>
      </div>
    );
  }
}
