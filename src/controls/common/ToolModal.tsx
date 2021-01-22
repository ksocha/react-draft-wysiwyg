import styled, { css } from 'styled-components';

interface Props {
  isOpen: boolean;
}

export const ToolModal = styled.div.attrs({ role: 'dialog' })<Props>`
  display: flex;
  flex-direction: column;
  width: 235px;
  height: 205px;
  border: 1px solid #f1f1f1;
  padding: 15px;
  border-radius: 2px;
  z-index: 100;
  background: white;
  box-shadow: 3px 3px 5px #bfbdbd;

  ${({ isOpen }) =>
    !isOpen &&
    css`
      visibility: hidden;
      pointer-events: none;
    `};
`;
