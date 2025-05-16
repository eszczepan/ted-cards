import { useState } from "react";

interface UseModalReturnType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Hook to manage modal state
 * @param initialState - Initial state of the modal (default: false)
 * @returns Object with isOpen, open, close, and toggle functions
 */
function useModal(initialState: boolean = false): UseModalReturnType {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

export default useModal;
