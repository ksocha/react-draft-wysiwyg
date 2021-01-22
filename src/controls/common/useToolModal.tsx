import { useCallback, useState } from 'react';
import { usePopper } from 'react-popper';

type PopperParams = Parameters<typeof usePopper>;

export default function useToolModal(
  referenceElement?: PopperParams[0],
  popperElement?: PopperParams[1]
) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const toggleModal = useCallback(() => setIsModalOpen(prev => !prev), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const popper = usePopper(referenceElement, popperElement, {
    modifiers: [
      { name: 'preventOverflow', enabled: false },
      { name: 'hide', enabled: false },
    ],
    placement: 'bottom-start',
  });

  return {
    ...popper,
    isModalOpen,
    openModal,
    toggleModal,
    closeModal,
  };
}
