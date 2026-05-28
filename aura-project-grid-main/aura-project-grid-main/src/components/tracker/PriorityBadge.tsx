import { Priority } from '@/types/task';

interface PriorityBadgeProps {
  priority: Priority;
}

const badgeClasses: Record<Priority, string> = {
  critical: 'bg-priority-critical/15 text-priority-critical',
  high: 'bg-priority-high/15 text-priority-high',
  medium: 'bg-priority-medium/15 text-priority-medium',
  low: 'bg-priority-low/15 text-priority-low',
};

const labels: Record<Priority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${badgeClasses[priority]}`}>
      {labels[priority]}
    </span>
  );
}
