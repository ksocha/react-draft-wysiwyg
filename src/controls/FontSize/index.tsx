import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { EditorState } from 'draft-js';
import { getSelectionCustomInlineStyle, toggleCustomInlineStyle } from 'draftjs-utils';

import fontSizeIcon from '../../../images/font-size.svg';
import { ToolDropdown } from '../common/ToolDropdown';
import { ToolGroup } from '../common/ToolGroup';

const defaultFontSize = 16;
const options = [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96];

interface Props {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
}

export default function FontSize({ onChange, editorState }: Props) {
  const intl = useIntl();

  const currentFontSize = useMemo(() => {
    const currentSize = getSelectionCustomInlineStyle(editorState, ['FONTSIZE']).FONTSIZE;
    const parsedSize = currentSize && Number(currentSize.substring(9));

    return parsedSize || defaultFontSize;
  }, [editorState]);

  return (
    <ToolGroup aria-label="rdw-font-size-control">
      <ToolDropdown
        options={options.map(val => ({ label: val, value: val }))}
        onChange={selectedValue => {
          if (selectedValue) {
            onChange(toggleCustomInlineStyle(editorState, 'fontSize', String(selectedValue)));
          }
        }}
        value={currentFontSize}
        icon={<img src={fontSizeIcon} alt="" />}
        title={intl.formatMessage({ id: 'wysiwygEditor.fontSize.title' })}
      />
    </ToolGroup>
  );
}
