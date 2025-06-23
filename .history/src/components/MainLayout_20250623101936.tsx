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
  return (
    <div className="min-h-screen bg-brand-background flex flex-col font-sans">
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
