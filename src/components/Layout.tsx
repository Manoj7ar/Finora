import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LogOut, BookOpen, Zap, LayoutDashboard, Menu, X, Settings,
  Bot, ClipboardList, Newspaper, Lightbulb, ChevronDown, Target,
  Brain, CloudLightning, Crosshair, User, Mic, ScrollText, Handshake, Users, Sparkles
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logoImg from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { useNotifications } from "@/hooks/use-notifications";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  const mainNav = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/goals", label: "Goals", icon: Target },
    { to: "/simulation", label: "Crisis Sim", icon: Zap },
    { to: "/education", label: "Learn", icon: BookOpen },
  ];

  const aiNav = [
    { to: "/ai-hub", label: "AI Hub", icon: Sparkles },
    { to: "/action-plan", label: "Action Plan", icon: ClipboardList },
    { to: "/news", label: "News Digest", icon: Newspaper },
    { to: "/what-if", label: "What If", icon: Lightbulb },
    { to: "/bias-mirror", label: "Bias Mirror", icon: Brain },
    { to: "/weather", label: "Eco Weather", icon: CloudLightning },
    { to: "/predict", label: "Predict Fed", icon: Crosshair },
    { to: "/twin", label: "Financial Twin", icon: User },
    { to: "/briefing", label: "Briefing", icon: Mic },
    { to: "/legislation", label: "Legislation", icon: ScrollText },
    { to: "/negotiate", label: "Negotiate", icon: Handshake },
    { to: "/community", label: "Community", icon: Users },
  ];

  const allNav = [...mainNav, ...aiNav, { to: "/settings", label: "Settings", icon: Settings }];

  const isActive = (path: string) => location.pathname === path;
  const isAiActive = aiNav.some((n) => isActive(n.to));
  const hideNav = location.pathname === "/auth" || location.pathname === "/forgot-password" || location.pathname === "/reset-password";

  return (
    <div className="min-h-screen bg-background">
      {!hideNav && <header className="fixed left-1/2 top-3 z-50 w-[calc(100%-1rem)] max-w-5xl -translate-x-1/2 sm:top-4 sm:w-[calc(100%-2rem)]">
        <nav className="flex h-12 items-center justify-between rounded-2xl border border-border/50 bg-background/60 px-3 shadow-card backdrop-blur-xl sm:h-14 sm:px-4">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <img src={logoImg} alt="Finora" className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="font-display text-base font-bold text-foreground sm:text-lg">Finora</span>
          </Link>

          {user && (
            <div className="hidden items-center gap-1 md:flex">
              {mainNav.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}>
                  <button
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
                      isActive(to)
                        ? "bg-primary/90 text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                </Link>
              ))}

              <div className="relative">
                <button
                  onClick={() => setAiMenuOpen(!aiMenuOpen)}
                  onBlur={() => setTimeout(() => setAiMenuOpen(false), 200)}
                  className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
                    isAiActive
                      ? "bg-primary/90 text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <Bot className="h-3.5 w-3.5" />
                  AI
                  <ChevronDown className={`h-3 w-3 transition-transform ${aiMenuOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {aiMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border/50 bg-background/95 shadow-card backdrop-blur-xl"
                    >
                      <div className="grid grid-cols-2 gap-0.5 p-1.5">
                        {aiNav.map(({ to, label, icon: Icon }) => (
                          <Link key={to} to={to} onClick={() => setAiMenuOpen(false)}>
                            <button
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                                isActive(to)
                                  ? "bg-primary/90 text-primary-foreground"
                                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              {label}
                            </button>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/settings">
                <button
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
                    isActive("/settings")
                      ? "bg-primary/90 text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {user && (
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAllRead={markAllRead}
                onClearAll={clearAll}
              />
            )}
            {user ? (
              <>
                <button
                  onClick={signOut}
                  className="hidden items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-foreground/5 hover:text-foreground md:inline-flex"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="inline-flex items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground md:hidden"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <Link to="/auth">
                <button className="inline-flex items-center rounded-xl bg-primary/90 px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-primary sm:px-4 sm:text-sm">
                  Get Started
                </button>
              </Link>
            )}
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && user && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 overflow-hidden rounded-2xl border border-border/50 bg-background/95 shadow-card backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-1 p-3 max-h-[70vh] overflow-y-auto">
                {allNav.map(({ to, label, icon: Icon }) => (
                  <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
                    <button
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive(to)
                          ? "bg-primary/90 text-primary-foreground"
                          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  </Link>
                ))}
                <div className="my-1 border-t border-border/50" />
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-foreground/5 hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>}

      <main className={hideNav ? "" : "pt-16 sm:pt-20"}>{children}</main>
    </div>
  );
}
