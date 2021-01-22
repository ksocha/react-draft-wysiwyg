import React, { HTMLAttributes, useCallback } from 'react';
import styled from 'styled-components';

import { ToolModal } from '../common/ToolModal';
import { emojis } from './emojis';

const Emojis = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
`;

const EmojiButton = styled.button`
  margin: 2px;
  padding: 0;
  height: 28px;
  width: 28px;
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background: none;
  border: none;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.mischka};
  }
`;

export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  isOpen: boolean;
  onSubmit: (emoji: string) => void;
  onCancel: () => void;
}

export const EmojiModal = React.forwardRef<HTMLDivElement, Props>(
  ({ onSubmit, onCancel, ...rest }, ref) => {
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        onSubmit(event.currentTarget.innerHTML);
      },
      [onSubmit]
    );

    return (
      <ToolModal role="dialog" {...rest} ref={ref}>
        <Emojis>
          {emojis.map(emoji => (
            <EmojiButton key={emoji} onClick={handleClick}>
              {emoji}
            </EmojiButton>
          ))}
        </Emojis>
      </ToolModal>
    );
  }
);
