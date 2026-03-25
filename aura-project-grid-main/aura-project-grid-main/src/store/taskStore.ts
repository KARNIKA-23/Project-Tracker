import { create } from 'zustand';
import { Task, Status, Priority, SortField, SortDirection, Filters, CollaboratorPresence, ViewType } from '@/types/task';
import { generateTasks, USERS } from '@/data/seed';

interface TaskStore {
  tasks: Task[];
  view: ViewType;
  sortField: SortField;
  sortDirection: SortDirection;
  filters: Filters;
  collaborators: CollaboratorPresence[];

  setView: (view: ViewType) => void;
  setSort: (field: SortField) => void;
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  setCollaborators: (collaborators: CollaboratorPresence[]) => void;
}

const EMPTY_FILTERS: Filters = {
  status: [],
  priority: [],
  assignee: [],
  dueDateFrom: null,
  dueDateTo: null,
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: generateTasks(500),
  view: 'kanban',
  sortField: 'dueDate',
  sortDirection: 'asc',
  filters: { ...EMPTY_FILTERS },
  collaborators: [],

  setView: (view) => set({ view }),

  setSort: (field) =>
    set((state) => ({
      sortField: field,
      sortDirection: state.sortField === field && state.sortDirection === 'asc' ? 'desc' : 'asc',
    })),

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),

  clearFilters: () => set({ filters: { ...EMPTY_FILTERS } }),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    })),

  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    })),

  setCollaborators: (collaborators) => set({ collaborators }),
}));

export const useFilteredTasks = () => {
  const { tasks, filters, sortField, sortDirection } = useTaskStore();

  let filtered = tasks;

  if (filters.status.length > 0) {
    filtered = filtered.filter((t) => filters.status.includes(t.status));
  }
  if (filters.priority.length > 0) {
    filtered = filtered.filter((t) => filters.priority.includes(t.priority));
  }
  if (filters.assignee.length > 0) {
    filtered = filtered.filter((t) => filters.assignee.includes(t.assignee.id));
  }
  if (filters.dueDateFrom) {
    filtered = filtered.filter((t) => t.dueDate >= filters.dueDateFrom!);
  }
  if (filters.dueDateTo) {
    filtered = filtered.filter((t) => t.dueDate <= filters.dueDateTo!);
  }

  return filtered;
};

export const useSortedFilteredTasks = () => {
  const filtered = useFilteredTasks();
  const { sortField, sortDirection } = useTaskStore();

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'title') cmp = a.title.localeCompare(b.title);
    else if (sortField === 'priority') cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
    else if (sortField === 'dueDate') cmp = a.dueDate.localeCompare(b.dueDate);
    return sortDirection === 'asc' ? cmp : -cmp;
  });

  return sorted;
};

export { EMPTY_FILTERS };
