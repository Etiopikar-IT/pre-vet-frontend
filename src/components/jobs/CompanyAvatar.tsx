interface CompanyAvatarProps {
  name: string;
  logo?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-10 w-10 rounded-lg text-sm",
  md: "h-14 w-14 rounded-xl text-xl",
  lg: "h-24 w-24 rounded-2xl text-3xl",
};

export default function CompanyAvatar({
  name,
  logo,
  size = "md",
  className = "",
}: CompanyAvatarProps) {
  const sizeClass = SIZES[size];

  if (logo) {
    return (
      <img
        src={logo}
        alt={name || "Company"}
        className={`shrink-0 border border-line object-cover ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-line bg-brand-50 font-semibold text-brand-600 ${sizeClass} ${className}`}
    >
      {name?.charAt(0).toUpperCase() || "?"}
    </div>
  );
}