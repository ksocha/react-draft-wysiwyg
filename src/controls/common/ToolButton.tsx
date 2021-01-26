import styled from 'styled-components';

export const ToolButton = styled.button.attrs({
  type: 'button',
})`
  border: 1px solid #f1f1f1;
  padding: 5px;
  min-width: 37px;
  height: 32px;
  border-radius: 2px;
  margin: 0 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;
  text-transform: capitalize;
  outline: none;

  &:hover {
    box-shadow: 1px 1px 0px #bfbdbd;
  }

  &:active,
  &[aria-pressed='true'] {
    box-shadow: 1px 1px 0px #bfbdbd inset;
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;
