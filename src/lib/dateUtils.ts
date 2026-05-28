export function formatDueDate(dueDateStr: string): {
  label: string;
  isOverdue: boolean;
  isDueToday: boolean;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr + 'T00:00:00');
  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / 86400000);

  if (diffDays === 0) {
    return { label: 'Due Today', isOverdue: false, isDueToday: true };
  }

  if (diffDays < -7) {
    return { label: `${Math.abs(diffDays)} days overdue`, isOverdue: true, isDueToday: false };
  }

  if (diffDays < 0) {
    return { label: formatDate(due), isOverdue: true, isDueToday: false };
  }

  return { label: formatDate(due), isOverdue: false, isDueToday: false };
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
