import { useTaskStore } from '@/store/taskStore';
import { useCollaborationSimulation, CollaborationBar } from './Collaboration';
import { ViewSwitcher } from './ViewSwitcher';
import { FilterBar } from './FilterBar';
import { KanbanBoard } from './KanbanBoard';
import { ListView } from './ListView';
import { TimelineView } from './TimelineView';

export function ProjectTracker() {
  const { view, setView } = useTaskStore();
  useCollaborationSimulation();

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Top bar */}
      <header className="shrink-0 px-6 py-4 border-b bg-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-none">Project Tracker</h1>
              <p className="text-xs text-muted-foreground mt-0.5">500 tasks · 6 team members</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CollaborationBar />
            <ViewSwitcher view={view} onViewChange={setView} />
          </div>
        </div>
        <FilterBar />
      </header>

      {/* View content */}
      <main className="flex-1 overflow-hidden p-4">
        {view === 'kanban' && <KanbanBoard />}
        {view === 'list' && <ListView />}
        {view === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
}
