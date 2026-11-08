import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ApplyModalContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const ApplyModalContext = createContext<ApplyModalContextValue | undefined>(
  undefined,
);

export function ApplyModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ open, close, isOpen }),
    [open, close, isOpen],
  );

  return (
    <ApplyModalContext.Provider value={value}>
      {children}
    </ApplyModalContext.Provider>
  );
}

export function useApplyModal() {
  const ctx = useContext(ApplyModalContext);
  if (!ctx) {
    throw new Error("useApplyModal must be used inside ApplyModalProvider");
  }
  return ctx;
}