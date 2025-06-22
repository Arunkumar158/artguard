import React from "react";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="py-4 border-b bg-dark-charcoal text-soft-linen-white">
        <div className="container flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold">
            ArtGuard
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/scan" className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group">
              Scan Artwork
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Link>
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group">
              Sign In
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-12">{children}</main>
      <footer className="py-6 text-center text-sm text-muted-foreground bg-soft-linen-white">
        <div className="container">
          © {new Date().getFullYear()} ArtGuard | Premium Art Authentication
        </div>
      </footer>
    </div>
  );
};
