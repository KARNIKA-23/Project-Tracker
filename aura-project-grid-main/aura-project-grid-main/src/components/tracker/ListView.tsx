import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Task, Status, STATUS_LABELS, STATUSES, PRIORITIES, SortField } from '@/types/task';
import { useTaskStore, useSortedFilteredTasks } from '@/store/taskStore';
import { Avatar } from './Avatar';
import { PriorityBadge } from './PriorityBadge';
import { DueDateLabel } from './DueDateLabel';

const ROW_HEIGHT = 48;
const BUFFER = 5;

export function ListView() {
  const tasks = useSortedFilteredTasks();
  const { sortField, sortDirection, setSort, updateTaskStatus } = useTaskStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  const { startIndex, endIndex, visibleTasks, offsetY } = useMemo(() => {
    const totalHeight = tasks.length * ROW_HEIGHT;
    const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
    const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT);
    const end = Math.min(tasks.length, start + visibleCount + BUFFER * 2);
    return {
      startIndex: start,
      endIndex: end,
      visibleTasks: tasks.slice(start, end),
      offsetY: start * ROW_HEIGHT,
    };
  }, [tasks, scrollTop, containerHeight]);

  const totalHeight = tasks.length * ROW_HEIGHT;

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => setSort(field)}
      className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors
        ${sortField === field ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
      `}
    >
      {label}
      {sortField === field && (
        <span className="text-[10px]">{sortDirection === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  );

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No tasks found</h3>
        <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
        <button
          onClick={() => useTaskStore.getState().clearFilters()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="grid grid-cols-[1fr_120px_100px_100px_120px] gap-4 px-4 py-3 border-b bg-card rounded-t-lg">
        <SortHeader field="title" label="Task" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assignee</span>
        <SortHeader field="priority" label="Priority" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
        <SortHeader field="dueDate" label="Due Date" />
      </div>

      {/* Virtual scrolling body */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleTasks.map((task) => (
              <ListRow key={task.id} task={task} onStatusChange={updateTaskStatus} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListRow({ task, onStatusChange }: { task: Task; onStatusChange: (id: string, s: Status) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="grid grid-cols-[1fr_120px_100px_100px_120px] gap-4 px-4 items-center border-b border-border/50 hover:bg-muted/30 transition-colors"
      style={{ height: ROW_HEIGHT }}
    >
      <span className="text-sm text-foreground truncate">{task.title}</span>
      <div className="flex items-center gap-1.5">
        <Avatar user={task.assignee} size="sm" />
        <span className="text-xs text-muted-foreground truncate">{task.assignee.name.split(' ')[0]}</span>
      </div>
      <PriorityBadge priority={task.priority} />

      {/* Inline status dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-[11px] font-medium px-2 py-1 rounded border bg-card text-foreground hover:bg-muted transition-colors w-full text-left truncate"
        >
          {STATUS_LABELS[task.status]}
        </button>
        {open && (
          <div className="absolute z-50 top-full mt-1 left-0 bg-card border rounded-lg shadow-lg py-1 min-w-[140px] animate-slide-in">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onStatusChange(task.id, s);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors
                  ${task.status === s ? 'text-primary font-semibold' : 'text-foreground'}
                `}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        )}
      </div>

      <DueDateLabel dueDate={task.dueDate} />
    </div>
  );
}
