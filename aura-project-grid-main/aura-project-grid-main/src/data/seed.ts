import { Task, User, Priority, Status } from '@/types/task';

const USERS: User[] = [
  { id: 'u1', name: 'Alex Chen', initials: 'AC', colorIndex: 1 },
  { id: 'u2', name: 'Maya Patel', initials: 'MP', colorIndex: 2 },
  { id: 'u3', name: 'Sam Rivera', initials: 'SR', colorIndex: 3 },
  { id: 'u4', name: 'Jordan Kim', initials: 'JK', colorIndex: 4 },
  { id: 'u5', name: 'Taylor Brooks', initials: 'TB', colorIndex: 1 },
  { id: 'u6', name: 'Casey Morgan', initials: 'CM', colorIndex: 2 },
];

const TASK_PREFIXES = [
  'Implement', 'Fix', 'Update', 'Refactor', 'Design', 'Test', 'Review',
  'Optimize', 'Add', 'Remove', 'Debug', 'Deploy', 'Configure', 'Migrate',
  'Document', 'Research', 'Prototype', 'Integrate', 'Validate', 'Monitor',
];

const TASK_SUBJECTS = [
  'user authentication flow', 'dashboard layout', 'search functionality',
  'notification system', 'payment integration', 'API endpoints', 'database schema',
  'caching layer', 'error handling', 'logging system', 'CI/CD pipeline',
  'unit tests', 'performance metrics', 'accessibility features', 'dark mode',
  'mobile responsive design', 'file upload component', 'data export feature',
  'user profile page', 'settings panel', 'onboarding wizard', 'email templates',
  'rate limiting', 'webhook handlers', 'chart components', 'form validation',
  'image optimization', 'SEO metadata', 'analytics tracking', 'user permissions',
  'backup system', 'load balancer config', 'SSL certificates', 'API documentation',
  'integration tests', 'staging environment', 'feature flags', 'A/B testing',
  'password reset flow', 'two-factor auth', 'session management', 'audit logs',
  'data migration script', 'cache invalidation', 'queue processing', 'batch jobs',
];

const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const STATUSES: Status[] = ['todo', 'in-progress', 'in-review', 'done'];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateTasks(count: number = 500): Task[] {
  const rand = seededRandom(42);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const tasks: Task[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const prefix = pick(TASK_PREFIXES);
    const subject = pick(TASK_SUBJECTS);

    // Due date: between 20 days ago and 30 days from now
    const dueDaysOffset = Math.floor(rand() * 50) - 20;
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + dueDaysOffset);

    // Start date: sometimes null (~15%), otherwise 1-14 days before due
    let startDate: string | null = null;
    if (rand() > 0.15) {
      const startOffset = Math.floor(rand() * 14) + 1;
      const sd = new Date(dueDate);
      sd.setDate(sd.getDate() - startOffset);
      startDate = sd.toISOString().split('T')[0];
    }

    const status = pick(STATUSES);
    const priority = pick(PRIORITIES);

    tasks.push({
      id: `task-${i + 1}`,
      title: `${prefix} ${subject}`,
      assignee: pick(USERS),
      priority,
      status,
      startDate,
      dueDate: dueDate.toISOString().split('T')[0],
      createdAt: new Date(now.getTime() - Math.floor(rand() * 30) * 86400000).toISOString(),
    });
  }

  return tasks;
}

export { USERS };
