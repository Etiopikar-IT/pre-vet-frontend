interface ProfileCoverProps {
  coverUrl?: string | null;
  height?: string;
  className?: string;
}

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";

export default function ProfileCover({
  coverUrl,
  height = "h-56 sm:h-72 lg:h-80",
  className = "",
}: ProfileCoverProps) {
  const src = coverUrl || DEFAULT_COVER;

  return (
    <div
      className={`relative z-0 w-full overflow-hidden bg-brand-600 ${height} ${className}`}
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Semi-transparent brand-tinted overlay so text/icons above stay readable */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-700/80 via-brand-500/60 to-brand-700/85" />

      {/* Subtle highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_55%)]" />
    </div>
  );
}