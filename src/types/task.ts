export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';

export interface User {
  id: string;
  name: string;
  initials: string;
  colorIndex: number; // 1-4 for user colors
}

export interface Task {
  id: string;
  title: string;
  assignee: User;
  priority: Priority;
  status: Status;
  startDate: string | null; // ISO date string
  dueDate: string; // ISO date string
  createdAt: string;
}

export type ViewType = 'kanban' | 'list' | 'timeline';

export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export interface Filters {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dueDateFrom: string | null;
  dueDateTo: string | null;
}

export interface CollaboratorPresence {
  user: User;
  taskId: string | null;
  isEditing: boolean;
}

export const STATUS_LABELS: Record<Status, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Done',
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  'critical': 0,
  'high': 1,
  'medium': 2,
  'low': 3,
};

export const STATUSES: Status[] = ['todo', 'in-progress', 'in-review', 'done'];
export const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
