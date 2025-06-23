import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";

interface HeaderProps {
  session: Session | null;
}

export const Header: React.FC<HeaderProps> = ({ session }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="py-4 border-b bg-brand-text text-brand-background">
      <div className="container flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-bold">
          ArtGuard
        </Link>
        <nav className="flex items-center gap-6">
          {session ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                Dashboard
                <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/auth")}
                variant="default"
                size="sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/auth")}
                variant="outline"
                size="sm"
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}; 