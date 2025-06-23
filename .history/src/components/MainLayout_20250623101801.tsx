import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  session,
}) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-brand-background flex flex-col font-sans">
      <header className="py-4 border-b bg-brand-text text-brand-background">
        <div className="container flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold">
            ArtGuard
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/scan"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
            >
              Scan Artwork
              <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
            >
              Dashboard
              <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            {session ? (
              <>
                <span className="text-sm text-gray-400">
                  {session.user.email}
                </span>
                <Button onClick={handleSignOut} variant="ghost" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                variant="default"
                size="sm"
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-12">{children}</main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          © {new Date().getFullYear()} ArtGuard | Premium Art Authentication
        </div>
      </footer>
    </div>
  );
};
