import React from "react";
import { Session } from "@supabase/supabase-js";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  session,
}) => {
  const [showBanner, setShowBanner] = React.useState(true);
  return (
    <div className="min-h-screen bg-brand-background flex flex-col font-sans">
      {showBanner && (
        <div className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white flex items-center justify-center py-2 px-4 shadow-md z-50">
          <span className="mr-4 text-base font-medium">🚀 Model v2.0 now detects AI art 20% more accurately!</span>
          <button
            onClick={() => setShowBanner(false)}
            className="ml-auto px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors"
            aria-label="Dismiss notification"
          >
            Dismiss
          </button>
        </div>
      )}
      <Header session={session} />
      <main className="flex-1 container py-12">{children}</main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          © {new Date().getFullYear()} ArtGuard | Premium Art Authentication
        </div>
      </footer>
    </div>
  );
};
