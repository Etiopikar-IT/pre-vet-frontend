import type { ReactNode } from "react";

interface HeaderShellProps {
  left: ReactNode;
  right: ReactNode;
}

export default function HeaderShell({ left, right }: HeaderShellProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">{left}</div>
        <nav className="flex items-center gap-2">{right}</nav>
      </div>
    </header>
  );
}