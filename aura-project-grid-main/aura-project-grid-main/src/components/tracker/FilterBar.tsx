import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { Status, Priority, STATUSES, PRIORITIES, STATUS_LABELS } from '@/types/task';
import { USERS } from '@/data/seed';

export function FilterBar() {
  const { filters, setFilters, clearFilters } = useTaskStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync URL → store on mount
  useEffect(() => {
    const status = searchParams.get('status')?.split(',').filter(Boolean) as Status[] | undefined;
    const priority = searchParams.get('priority')?.split(',').filter(Boolean) as Priority[] | undefined;
    const assignee = searchParams.get('assignee')?.split(',').filter(Boolean);
    const dueDateFrom = searchParams.get('dueDateFrom') || null;
    const dueDateTo = searchParams.get('dueDateTo') || null;

    setFilters({
      status: status || [],
      priority: priority || [],
      assignee: assignee || [],
      dueDateFrom,
      dueDateTo,
    });
  }, []);

  // Sync store → URL on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status.length) params.set('status', filters.status.join(','));
    if (filters.priority.length) params.set('priority', filters.priority.join(','));
    if (filters.assignee.length) params.set('assignee', filters.assignee.join(','));
    if (filters.dueDateFrom) params.set('dueDateFrom', filters.dueDateFrom);
    if (filters.dueDateTo) params.set('dueDateTo', filters.dueDateTo);
    setSearchParams(params, { replace: true });
  }, [filters]);

  const hasFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0 ||
    !!filters.dueDateFrom ||
    !!filters.dueDateTo;

  const toggleFilter = useCallback(
    <T extends string>(key: 'status' | 'priority' | 'assignee', value: T) => {
      const current = filters[key] as T[];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      setFilters({ [key]: next });
    },
    [filters, setFilters]
  );

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-card rounded-lg border">
      {/* Status filter */}
      <FilterGroup label="Status">
        {STATUSES.map((s) => (
          <FilterChip
            key={s}
            label={STATUS_LABELS[s]}
            active={filters.status.includes(s)}
            onClick={() => toggleFilter('status', s)}
          />
        ))}
      </FilterGroup>

      <div className="w-px h-6 bg-border" />

      {/* Priority filter */}
      <FilterGroup label="Priority">
        {PRIORITIES.map((p) => (
          <FilterChip
            key={p}
            label={p.charAt(0).toUpperCase() + p.slice(1)}
            active={filters.priority.includes(p)}
            onClick={() => toggleFilter('priority', p)}
          />
        ))}
      </FilterGroup>

      <div className="w-px h-6 bg-border" />

      {/* Assignee filter */}
      <FilterGroup label="Assignee">
        {USERS.map((u) => (
          <FilterChip
            key={u.id}
            label={u.initials}
            active={filters.assignee.includes(u.id)}
            onClick={() => toggleFilter('assignee', u.id)}
          />
        ))}
      </FilterGroup>

      <div className="w-px h-6 bg-border" />

      {/* Date range */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">From</span>
        <input
          type="date"
          value={filters.dueDateFrom || ''}
          onChange={(e) => setFilters({ dueDateFrom: e.target.value || null })}
          className="text-xs border rounded px-2 py-1 bg-card text-foreground"
        />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">To</span>
        <input
          type="date"
          value={filters.dueDateTo || ''}
          onChange={(e) => setFilters({ dueDateTo: e.target.value || null })}
          className="text-xs border rounded px-2 py-1 bg-card text-foreground"
        />
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="ml-auto text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">{label}</span>
      {children}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-[11px] font-medium transition-all
        ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'}
      `}
    >
      {label}
    </button>
  );
}
