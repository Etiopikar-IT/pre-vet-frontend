import UserAvatar from "./UserAvatar";
import { ChevronDownIcon } from "./icons";

interface ProfileTriggerProps {
  email: string;
  displayName: string;
  open: boolean;
  onClick: () => void;
}

export default function ProfileTrigger({
  email,
  displayName,
  open,
  onClick,
}: ProfileTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border border-line bg-surface p-1 pr-3 transition hover:border-brand-300 hover:bg-brand-50"
      aria-haspopup="menu"
      aria-expanded={open}
    >
      <UserAvatar email={email} size="sm" />

      <span className="hidden text-sm font-medium text-ink-700 sm:inline">
        {displayName}
      </span>

      <ChevronDownIcon
        className={`h-3.5 w-3.5 text-ink-500 transition ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}