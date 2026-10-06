interface ProfileTabItem {
  id: string;
  label: string;
}

interface ProfileTabsProps {
  tabs: ProfileTabItem[];
  active: string;
  onChange: (id: string) => void;
}

export default function ProfileTabs({
  tabs,
  active,
  onChange,
}: ProfileTabsProps) {
  return (
    <div className="flex gap-1 border-b border-line">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "text-brand-600"
                : "text-ink-500 hover:text-ink-700"
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}