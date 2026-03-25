import { ViewType } from '@/types/task';

interface ViewSwitcherProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views: { key: ViewType; label: string; icon: string }[] = [
  { key: 'kanban', label: 'Board', icon: '▦' },
  { key: 'list', label: 'List', icon: '☰' },
  { key: 'timeline', label: 'Timeline', icon: '⟿' },
];

export function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex bg-muted rounded-lg p-0.5">
      {views.map((v) => (
        <button
          key={v.key}
          onClick={() => onViewChange(v.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
            ${view === v.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}
          `}
        >
          <span className="text-base">{v.icon}</span>
          {v.label}
        </button>
      ))}
    </div>
  );
}
