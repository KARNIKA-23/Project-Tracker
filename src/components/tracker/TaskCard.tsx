import { Task, CollaboratorPresence } from '@/types/task';
import { Avatar, AvatarStack } from './Avatar';
import { PriorityBadge } from './PriorityBadge';
import { DueDateLabel } from './DueDateLabel';
import React, { useRef } from 'react';

interface TaskCardProps {
  task: Task;
  collaborators?: CollaboratorPresence[];
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent | React.PointerEvent, task: Task) => void;
  onDragEnd?: () => void;
}

export function TaskCard({ task, collaborators = [], isDragging, onDragStart, onDragEnd }: TaskCardProps) {
  const activeCollabs = collaborators.filter((c) => c.taskId === task.id);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
      onDragEnd={onDragEnd}
      className={`group relative bg-card rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-all duration-150
        ${isDragging ? 'opacity-50 shadow-drag scale-[1.02]' : 'hover:shadow-md hover:border-ring/30'}
      `}
    >
      {/* Collaborator indicators */}
      {activeCollabs.length > 0 && (
        <div className="absolute -top-2 -right-2 animate-presence-in">
          <AvatarStack users={activeCollabs.map((c) => c.user)} max={2} size="sm" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-card-foreground leading-tight line-clamp-2">
          {task.title}
        </h4>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Avatar user={task.assignee} size="sm" />
          <PriorityBadge priority={task.priority} />
        </div>
        <DueDateLabel dueDate={task.dueDate} />
      </div>
    </div>
  );
}
