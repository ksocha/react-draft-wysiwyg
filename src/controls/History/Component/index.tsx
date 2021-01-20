import './styles.css';

import React, { Component } from 'react';

import { Dropdown, DropdownOption } from '../../../components/Dropdown';
import Option from '../../../components/Option';
import { getFirstIcon } from '../../../utils/toolbar';
import redoIcon from '../../../../images/redo.svg';
import undoIcon from '../../../../images/undo.svg';

export interface HistoryConfig {
  inDropdown: false;
}

interface Props {
  expanded: boolean;
  doExpand: () => void;
  doCollapse: () => void;
  onExpandEvent: () => void;
  config: HistoryConfig;
  onChange: (action: string) => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  translations: object;
}

export class History extends Component<Props> {
  renderInDropDown() {
    const {
      config,
      expanded,
      doExpand,
      onExpandEvent,
      doCollapse,
      onChange,
      undoDisabled,
      redoDisabled,
      translations,
    } = this.props;

    return (
      <Dropdown
        className="rdw-history-dropdown"
        expanded={expanded}
        doExpand={doExpand}
        doCollapse={doCollapse}
        onExpandEvent={onExpandEvent}
        aria-label="rdw-history-control"
        title={translations['components.controls.history.history']}
      >
        <img src={getFirstIcon(config)} alt="" />
        <DropdownOption
          value="undo"
          onClick={onChange}
          disabled={undoDisabled}
          className="rdw-history-dropdownoption"
          title={translations['components.controls.history.undo']}
        >
          <img src={undoIcon} alt="" />
        </DropdownOption>

        <DropdownOption
          value="redo"
          onClick={onChange}
          disabled={redoDisabled}
          className="rdw-history-dropdownoption"
          title={translations['components.controls.history.redo']}
        >
          <img src={redoIcon} alt="" />
        </DropdownOption>
      </Dropdown>
    );
  }

  renderInFlatList() {
    const { undoDisabled, redoDisabled, translations, onChange } = this.props;
    return (
      <div className="rdw-history-wrapper" aria-label="rdw-history-control">
        <Option
          value="undo"
          onClick={onChange}
          disabled={undoDisabled}
          title={translations['components.controls.history.undo']}
        >
          <img src={undoIcon} alt="" />
        </Option>

        <Option
          value="redo"
          onClick={onChange}
          disabled={redoDisabled}
          title={translations['components.controls.history.redo']}
        >
          <img src={redoIcon} alt="" />
        </Option>
      </div>
    );
  }

  render() {
    const { config } = this.props;
    if (config.inDropdown) {
      return this.renderInDropDown();
    }
    return this.renderInFlatList();
  }
}
