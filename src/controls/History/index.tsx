import React, { Component } from 'react';
import { EditorState } from 'draft-js';

import ModalHandler from '../../event-handler/modals';
import { History as HistoryComponent, HistoryConfig } from './Component';

interface Props {
  onChange: (editorState: EditorState) => void;
  editorState?: EditorState;
  modalHandler: ModalHandler;
  config?: HistoryConfig;
  translations?: object;
}

interface State {
  expanded: boolean;
}

export default class History extends Component<Props, State> {
  state: State = {
    expanded: false,
  };

  componentDidMount() {
    const { modalHandler } = this.props;
    modalHandler.registerCallBack(this.expandCollapse);
  }

  componentWillUnmount() {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  onExpandEvent = () => {
    this.signalExpanded = !this.state.expanded;
  };

  onChange = (action: string) => {
    const { editorState, onChange } = this.props;
    const newState = EditorState[action](editorState);
    if (newState) {
      onChange(newState);
    }
  };

  doExpand = () => this.setState({ expanded: true });

  doCollapse = () => this.setState({ expanded: false });

  expandCollapse = () => {
    this.setState({ expanded: this.signalExpanded });
    this.signalExpanded = false;
  };

  render() {
    const { config, translations, editorState } = this.props;
    const { expanded } = this.state;

    return (
      <HistoryComponent
        config={config}
        translations={translations}
        undoDisabled={editorState?.getUndoStack().size === 0}
        redoDisabled={editorState?.getRedoStack().size === 0}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        onChange={this.onChange}
      />
    );
  }
}
