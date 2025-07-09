import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResetPasswordPage from "./pages/ResetPassword";
import Insights from "./pages/Insights";
import ApiAccess from "./pages/ApiAccess";
import ScanHistory from "./pages/ScanHistory";
import { Toaster } from "./components/ui/toaster";
import { MainLayout } from "./components/MainLayout";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <MainLayout session={session}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/api-access" element={<ApiAccess />} />
        <Route path="/scan-history" element={<ScanHistory />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute session={session}>
              <Dashboard session={session} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </MainLayout>
  );
}

function ProtectedRoute({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

export default App;
