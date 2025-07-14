import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "./ui/sheet";

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
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {session ? (
            <>
              <Link
                to="/scan-history"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                Scan History
                <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
              <Link
                to="/insights"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                Insights
                <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
              <Link
                to="/api-access"
                className="text-sm font-medium text-gray-300 hover:text-[#FF7F50] transition-colors duration-200"
              >
                API Access
              </Link>
              <Link
                to="/account"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                Account
                <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-brand-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                Sign Out
              </Button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group px-4 py-2 rounded-md border border-transparent hover:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '2.25rem' }}
            >
              Sign In
            </Link>
          )}
        </nav>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label="Open menu">
                <Menu className="w-7 h-7 text-white" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 max-w-full">
              <SheetHeader className="bg-[#FF7F50] px-6 py-4">
                <SheetTitle className="text-white text-xl font-bold">ArtGuard</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-6 py-4">
                {session ? (
                  <>
                    <Link to="/scan-history" className="py-2 text-base font-medium rounded hover:bg-[#FFF4F0] transition-colors text-[#111827]" onClick={() => document.activeElement && (document.activeElement as HTMLElement).blur()}>
                      Scan History
                    </Link>
                    <Link to="/insights" className="py-2 text-base font-medium rounded hover:bg-[#FFF4F0] transition-colors text-[#111827]">
                      Insights
                    </Link>
                    <Link to="/api-access" className="py-2 text-base font-medium rounded hover:bg-[#FFF4F0] transition-colors text-[#111827]">
                      API Access
                    </Link>
                    <Link to="/account" className="py-2 text-base font-medium rounded hover:bg-[#FFF4F0] transition-colors text-[#111827]">
                      Account
                    </Link>
                    <div className="flex-1" />
                    <SheetClose asChild>
                      <Button onClick={handleSignOut} variant="destructive" className="w-full mt-6 bg-[#FF7F50] hover:bg-[#FF7F50]/90 text-white">
                        Sign Out
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <Link to="/auth" className="py-2 text-base font-medium rounded hover:bg-[#FFF4F0] transition-colors text-[#111827]">
                    Sign In
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}; 