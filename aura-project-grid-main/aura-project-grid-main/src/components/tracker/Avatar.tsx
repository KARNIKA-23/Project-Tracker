import { User } from '@/types/task';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

const colorClasses: Record<number, string> = {
  1: 'bg-user-1',
  2: 'bg-user-2',
  3: 'bg-user-3',
  4: 'bg-user-4',
};

export function Avatar({ user, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[user.colorIndex]} rounded-full flex items-center justify-center text-primary-foreground font-semibold shrink-0 ${className}`}
      title={user.name}
    >
      {user.initials}
    </div>
  );
}

interface AvatarStackProps {
  users: User[];
  max?: number;
  size?: 'sm' | 'md';
}

export function AvatarStack({ users, max = 3, size = 'sm' }: AvatarStackProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div className="flex -space-x-1.5">
      {visible.map((u) => (
        <Avatar key={u.id} user={u} size={size} className="ring-2 ring-card" />
      ))}
      {overflow > 0 && (
        <div
          className={`${sizeClasses[size]} rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold ring-2 ring-card`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
