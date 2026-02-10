interface LevelBadgeProps {
  level: number;
  title: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LevelBadge({ level, title, size = 'md' }: LevelBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 font-bold border border-yellow-500/30`}
      >
        Lv.{level}
      </span>
      <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-yellow-300`}>
        {title}
      </span>
    </div>
  );
}
