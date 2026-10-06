interface ProfileStat {
  value: number | string;
  label: string;
}

interface ProfileStatsProps {
  stats: ProfileStat[];
  className?: string;
}

export default function ProfileStats({
  stats,
  className = "",
}: ProfileStatsProps) {
  if (stats.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-4 text-sm ${className}`}>
      {stats.map((stat, index) => (
        <li key={index}>
          <span className="font-semibold text-ink-800">{stat.value}</span>{" "}
          <span className="text-ink-500">{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}