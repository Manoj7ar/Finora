import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Simulation from "@/pages/Simulation";
import Education from "@/pages/Education";
import Settings from "@/pages/Settings";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import AdvisorChat from "@/pages/AdvisorChat";
import ActionPlan from "@/pages/ActionPlan";
import NewsDigest from "@/pages/NewsDigest";
import WhatIf from "@/pages/WhatIf";
import Goals from "@/pages/Goals";
import Achievements from "@/pages/Achievements";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<PublicOnlyRoute><Landing /></PublicOnlyRoute>} />
                <Route path="/auth" element={<PublicOnlyRoute><Auth /></PublicOnlyRoute>} />
                <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/advisor" element={<ProtectedRoute><AdvisorChat /></ProtectedRoute>} />
                <Route path="/action-plan" element={<ProtectedRoute><ActionPlan /></ProtectedRoute>} />
                <Route path="/news" element={<ProtectedRoute><NewsDigest /></ProtectedRoute>} />
                <Route path="/what-if" element={<ProtectedRoute><WhatIf /></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                <Route path="/simulation" element={<ProtectedRoute><Simulation /></ProtectedRoute>} />
                <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
                <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
