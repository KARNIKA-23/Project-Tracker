import { formatDueDate } from '@/lib/dateUtils';

interface DueDateLabelProps {
  dueDate: string;
}

export function DueDateLabel({ dueDate }: DueDateLabelProps) {
  const { label, isOverdue, isDueToday } = formatDueDate(dueDate);

  return (
    <span
      className={`text-xs font-medium ${
        isOverdue ? 'text-destructive' : isDueToday ? 'text-priority-high font-semibold' : 'text-muted-foreground'
      }`}
    >
      {label}
    </span>
  );
}
