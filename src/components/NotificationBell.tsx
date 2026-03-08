import { useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { type Notification } from "@/hooks/use-notifications";

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

const severityIcon = (severity: string) => {
  switch (severity) {
    case "critical": return <AlertCircle className="h-4 w-4 text-destructive" />;
    case "warning": return <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />;
    default: return <Info className="h-4 w-4 text-primary" />;
  }
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationBell({
  notifications,
  unreadCount,
  onMarkAllRead,
  onClearAll,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border/50 bg-background/95 shadow-modal backdrop-blur-xl sm:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAllRead}
                    className="h-7 gap-1 px-2 text-xs"
                  >
                    <Check className="h-3 w-3" /> Read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { onClearAll(); setOpen(false); }}
                    className="h-7 gap-1 px-2 text-xs text-muted-foreground"
                  >
                    <Trash2 className="h-3 w-3" /> Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10">
                  <Bell className="h-8 w-8 text-muted/40" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                  <p className="text-xs text-muted-foreground/60">
                    Alerts appear when indicators change significantly
                  </p>
                </div>
              ) : (
                notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex gap-3 border-b border-border/30 px-4 py-3 transition-colors last:border-b-0 ${
                      !n.read ? "bg-primary/[0.03]" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {severityIcon(n.severity)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-tight ${!n.read ? "font-semibold text-foreground" : "text-foreground/80"}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {n.message}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
