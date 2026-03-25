import { useState, useRef, useCallback } from 'react';
import { Task, Status, STATUS_LABELS, STATUSES } from '@/types/task';
import { useTaskStore, useFilteredTasks } from '@/store/taskStore';
import { TaskCard } from './TaskCard';

export function KanbanBoard() {
  const { moveTask, collaborators } = useTaskStore();
  const filtered = useFilteredTasks();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);

  const handleDragStart = useCallback((_e: React.DragEvent | React.PointerEvent, task: Task) => {
    setDraggedTask(task);
    if ('dataTransfer' in _e) {
      (_e as React.DragEvent).dataTransfer.effectAllowed = 'move';
      (_e as React.DragEvent).dataTransfer.setData('text/plain', task.id);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: Status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, status: Status) => {
      e.preventDefault();
      if (draggedTask) {
        moveTask(draggedTask.id, status);
      }
      setDraggedTask(null);
      setDragOverColumn(null);
    },
    [draggedTask, moveTask]
  );

  const statusColors: Record<Status, string> = {
    'todo': 'bg-status-todo',
    'in-progress': 'bg-status-progress',
    'in-review': 'bg-status-review',
    'done': 'bg-status-done',
  };

  return (
    <div className="flex gap-4 h-full overflow-x-auto pb-4">
      {STATUSES.map((status) => {
        const columnTasks = filtered.filter((t) => t.status === status);
        const isDropTarget = dragOverColumn === status;

        return (
          <div
            key={status}
            className={`flex-1 min-w-[280px] max-w-[340px] flex flex-col rounded-xl transition-colors duration-150
              ${isDropTarget ? 'bg-accent/80' : 'bg-muted/40'}
            `}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
          >
            {/* Column header */}
            <div className="flex items-center gap-2 p-3 pb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
              <h3 className="text-sm font-semibold text-foreground">{STATUS_LABELS[status]}</h3>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {columnTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2 space-y-2">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground">No tasks here</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">Drag tasks to this column</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div key={task.id} className={draggedTask?.id === task.id ? 'opacity-30' : ''}>
                    <TaskCard
                      task={task}
                      collaborators={collaborators}
                      isDragging={draggedTask?.id === task.id}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
