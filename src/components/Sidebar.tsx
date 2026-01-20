import { FolderOpen, HardDrive, Cloud, Settings, FileStack } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  totalFiles: number;
}

export function Sidebar({ totalFiles }: SidebarProps) {
  const menuItems = [
    { icon: FolderOpen, label: 'All Files', active: true, count: totalFiles },
    { icon: Cloud, label: 'Cloud Sync', active: false },
    { icon: FileStack, label: 'Recent', active: false },
  ];

  return (
    <aside className="w-56 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <HardDrive className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">LokroCloud</h1>
            <p className="text-xs text-muted-foreground">File Manager</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              item.active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            )}
          >
            <item.icon className={cn('h-4 w-4', item.active && 'text-primary')} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.count !== undefined && (
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                item.active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              )}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
