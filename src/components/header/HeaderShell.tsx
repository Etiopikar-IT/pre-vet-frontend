import type { ReactNode } from "react";

interface HeaderShellProps {
  left: ReactNode;
  right: ReactNode;
  bottom?: ReactNode;
}

export default function HeaderShell({
  left,
  right,
  bottom,
}: HeaderShellProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex shrink-0 items-center gap-3">{left}</div>
        <nav className="flex min-w-0 items-center gap-2">{right}</nav>
      </div>

      {bottom && (
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 overflow-x-auto px-6 py-2">
            {bottom}
          </div>
        </div>
      )}
    </header>
  );
}