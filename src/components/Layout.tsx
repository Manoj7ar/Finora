import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart3, BookOpen, Zap, LayoutDashboard } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/simulation", label: "Crisis Sim", icon: Zap },
    { to: "/education", label: "Learn", icon: BookOpen },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
        <nav className="flex h-14 items-center justify-between rounded-2xl border border-border/50 bg-background/60 px-4 shadow-card backdrop-blur-xl">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">Finora</span>
          </Link>

          {user && (
            <div className="hidden items-center gap-1 md:flex">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}>
                  <button
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all ${
                      isActive(to)
                        ? "bg-primary/90 text-primary-foreground shadow-sm backdrop-blur-sm"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground hover:backdrop-blur-sm"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-foreground/5 hover:text-foreground hover:backdrop-blur-sm"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            ) : (
              <Link to="/auth">
                <button className="inline-flex items-center rounded-xl bg-primary/90 px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-primary">
                  Get Started
                </button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-20">{children}</main>
    </div>
  );
}
