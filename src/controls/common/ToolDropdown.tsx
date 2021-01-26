import React, { useRef } from 'react';
import { usePopper } from 'react-popper';
import { useSelect } from 'downshift';
import { find } from 'lodash';
import { rem, rgba, size } from 'polished';
import styled, { css } from 'styled-components';

import { ToolButton } from './ToolButton';

// TODO: remove
const StyledIconArrow = styled.div`
  ${size(rem(5), rem(10))};
  fill: ${({ theme }) => theme.colors.grey};
  transition: fill 0.3s ease;
`;

const IconArrowWrapper = styled.div<{ isOpen?: boolean }>`
  display: flex;
  padding-left: ${rem(8)};
  margin-left: auto;
  transition: transform 0.3s ease;

  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: scaleY(-1);

      ${StyledIconArrow} {
        fill: ${({ theme }) => theme.colors.main};
      }
    `};
`;

const Wrapper = styled.div`
  position: relative;
`;

/* z-index: ${misc.zIndex1}; */
const DropdownMenu = styled.ul<{ isOpen?: boolean }>`
  ${({ isOpen }) =>
    !isOpen &&
    css`
      visibility: hidden;
      pointer-events: none;
    `};
  z-index: 1000;
  width: 100%;
  padding: ${rem(10)};
  margin: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  box-shadow: ${rem(3)} ${rem(3)} ${rem(15)} ${rgba(0, 0, 0, 0.1)};
  outline: none;
  list-style: none;
`;

const DropdownItem = styled.li<{ isHighlighted?: boolean }>`
  color: ${({ theme, isHighlighted }) => (isHighlighted ? theme.colors.main : theme.colors.grey)};

  & + & {
    margin-top: ${rem(10)};
  }
`;

export interface Option {
  value: React.ReactText;
  label: React.ReactText;
}

export interface Props<TOption extends Option> {
  options: TOption[];
  value: TOption['value'];
  disabled?: boolean;
  onChange: (value: TOption['value'] | null) => void;
  title?: string;
  icon: React.ReactNode;
}

export function ToolDropdown<TOption extends Option>({
  options,
  value,
  disabled,
  onChange,
  title,
  icon,
}: Props<TOption>) {
  const referenceElementRef = useRef(null);
  const popperElementRef = useRef(null);

  const {
    getItemProps,
    getToggleButtonProps,
    getMenuProps,
    isOpen,
    selectedItem,
    highlightedIndex,
  } = useSelect<TOption>({
    onSelectedItemChange: changes => onChange(changes.selectedItem?.value || null),
    itemToString: item => (item ? String(item.value) : ''),
    selectedItem: find(options, item => item.value === value),
    items: options,
  });

  const { styles, attributes } = usePopper(referenceElementRef.current, popperElementRef.current, {
    modifiers: [
      { name: 'preventOverflow', enabled: false },
      { name: 'hide', enabled: false },
    ],
    placement: 'bottom-start',
  });

  return (
    <Wrapper>
      <ToolButton {...getToggleButtonProps({ disabled, ref: referenceElementRef, title })}>
        {icon}
        {selectedItem && selectedItem.label}
        {!disabled && (
          <IconArrowWrapper isOpen={isOpen}>
            <StyledIconArrow />
          </IconArrowWrapper>
        )}
      </ToolButton>

      <DropdownMenu
        isOpen={isOpen}
        {...getMenuProps({ ref: popperElementRef, style: styles.popper, ...attributes.popper })}
      >
        {options.map((item, index) => (
          <DropdownItem
            {...getItemProps({
              key: item.value,
              index,
              item,
            })}
            isHighlighted={highlightedIndex === index}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Wrapper>
  );
}
