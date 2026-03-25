import { useEffect, useRef } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { CollaboratorPresence, User } from '@/types/task';

const SIMULATED_USERS: User[] = [
  { id: 'sim-1', name: 'Robin Lee', initials: 'RL', colorIndex: 1 },
  { id: 'sim-2', name: 'Dana Moss', initials: 'DM', colorIndex: 3 },
  { id: 'sim-3', name: 'Kai Tanaka', initials: 'KT', colorIndex: 4 },
];

export function useCollaborationSimulation() {
  const { tasks, setCollaborators } = useTaskStore();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (tasks.length === 0) return;

    const taskIds = tasks.slice(0, 50).map((t) => t.id); // Only use first 50 for perf

    const randomTaskId = () => taskIds[Math.floor(Math.random() * taskIds.length)];

    // Initialize presence
    const initial: CollaboratorPresence[] = SIMULATED_USERS.map((user) => ({
      user,
      taskId: randomTaskId(),
      isEditing: Math.random() > 0.7,
    }));
    setCollaborators(initial);

    // Move users around every 3-6 seconds
    intervalRef.current = setInterval(() => {
      setCollaborators(
        SIMULATED_USERS.map((user) => ({
          user,
          taskId: Math.random() > 0.1 ? randomTaskId() : null,
          isEditing: Math.random() > 0.7,
        }))
      );
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tasks.length]);
}

export function CollaborationBar() {
  const { collaborators } = useTaskStore();
  const activeCount = collaborators.filter((c) => c.taskId !== null).length;

  if (activeCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-1.5">
        {collaborators
          .filter((c) => c.taskId !== null)
          .map((c) => (
            <div
              key={c.user.id}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-primary-foreground ring-2 ring-card animate-presence-in
                ${c.user.colorIndex === 1 ? 'bg-user-1' : c.user.colorIndex === 3 ? 'bg-user-3' : 'bg-user-4'}
              `}
              title={c.user.name}
            >
              {c.user.initials}
            </div>
          ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {activeCount} {activeCount === 1 ? 'person is' : 'people are'} viewing this board
      </span>
    </div>
  );
}

export { SIMULATED_USERS };
