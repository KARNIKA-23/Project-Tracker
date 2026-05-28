import { useMemo } from 'react';
import { useFilteredTasks } from '@/store/taskStore';
import { Priority } from '@/types/task';

const priorityBarColors: Record<Priority, string> = {
  critical: 'bg-priority-critical',
  high: 'bg-priority-high',
  medium: 'bg-priority-medium',
  low: 'bg-priority-low',
};

export function TimelineView() {
  const tasks = useFilteredTasks();

  const { days, startDate, totalDays, todayIndex } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const total = end.getDate();
    const todayIdx = now.getDate() - 1;

    const dayArray = Array.from({ length: total }, (_, i) => {
      const d = new Date(year, month, i + 1);
      return {
        date: d,
        label: String(i + 1),
        dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
        isoDate: d.toISOString().split('T')[0],
      };
    });

    return { days: dayArray, startDate: start, totalDays: total, todayIndex: todayIdx };
  }, []);

  const DAY_WIDTH = 40;
  const ROW_HEIGHT = 36;

  const taskBars = useMemo(() => {
    const startISO = days[0].isoDate;
    const endISO = days[days.length - 1].isoDate;

    return tasks
      .filter((t) => {
        const effectiveStart = t.startDate || t.dueDate;
        return effectiveStart <= endISO && t.dueDate >= startISO;
      })
      .map((task) => {
        const effectiveStart = task.startDate || task.dueDate;
        const startDay = Math.max(0, Math.round((new Date(effectiveStart).getTime() - startDate.getTime()) / 86400000));
        const endDay = Math.min(totalDays - 1, Math.round((new Date(task.dueDate).getTime() - startDate.getTime()) / 86400000));
        const span = Math.max(1, endDay - startDay + 1);

        return { task, startDay, span };
      });
  }, [tasks, days, startDate, totalDays]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-muted-foreground">No tasks to display on timeline</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin border rounded-lg bg-card">
      {/* Day headers */}
      <div className="flex border-b sticky top-0 bg-card z-10">
        <div className="w-[200px] shrink-0 px-3 py-2 border-r bg-muted/30">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Task</span>
        </div>
        <div className="flex relative">
          {days.map((day, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center border-r py-1
                ${i === todayIndex ? 'bg-primary/10' : ''}
              `}
              style={{ width: DAY_WIDTH }}
            >
              <span className="text-[9px] text-muted-foreground">{day.dayOfWeek}</span>
              <span className={`text-xs font-medium ${i === todayIndex ? 'text-primary font-bold' : 'text-foreground'}`}>
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Task rows */}
      <div className="relative">
        {/* Today line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary/60 z-10"
          style={{ left: 200 + todayIndex * DAY_WIDTH + DAY_WIDTH / 2 }}
        />

        {taskBars.map(({ task, startDay, span }, idx) => (
          <div key={task.id} className="flex border-b border-border/30 hover:bg-muted/20 transition-colors" style={{ height: ROW_HEIGHT }}>
            <div className="w-[200px] shrink-0 px-3 flex items-center border-r">
              <span className="text-xs text-foreground truncate">{task.title}</span>
            </div>
            <div className="relative flex-1" style={{ minWidth: totalDays * DAY_WIDTH }}>
              <div
                className={`absolute top-1.5 h-5 rounded-full ${priorityBarColors[task.priority]} opacity-80 hover:opacity-100 transition-opacity cursor-default`}
                style={{
                  left: startDay * DAY_WIDTH + 4,
                  width: Math.max(span * DAY_WIDTH - 8, 8),
                }}
                title={`${task.title} (${task.priority})`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
