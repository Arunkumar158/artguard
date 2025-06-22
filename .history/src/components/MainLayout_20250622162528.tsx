import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      <header className="py-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500"></div>
            <span className="font-medium">ArtGuard</span>
          </Link>
          <div className="flex items-center gap-2">
            {!loading &&
              (user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              ))}
          </div>
        </div>
      </header>
      <main className="flex-1 container py-12">{children}</main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          © {new Date().getFullYear()} ArtGuard · Artwork Classification Technology
        </div>
      </footer>
    </div>
  );
};
