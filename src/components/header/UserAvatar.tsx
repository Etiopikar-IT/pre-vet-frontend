interface UserAvatarProps {
  email: string;
  src?: string | null;
  size?: "sm" | "md";
  className?: string;
}

function initials(email: string) {
  const name = email.split("@")[0] ?? "";
  return name.slice(0, 2).toUpperCase();
}

export default function UserAvatar({
  email,
  src,
  size = "sm",
  className = "",
}: UserAvatarProps) {
  const sizeClass =
    size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  if (src) {
    return (
      <img
        src={src}
        alt={email}
        className={`shrink-0 rounded-full border border-line object-cover ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-500 font-semibold text-white ${sizeClass} ${className}`}
    >
      {initials(email)}
    </span>
  );
}