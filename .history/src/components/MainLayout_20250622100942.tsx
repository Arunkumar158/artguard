
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      <header className="py-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500"></div>
            <span className="font-medium">ArtSense</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
        </div>
      </header>
      <main className="flex-1 container py-12">{children}</main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          © {new Date().getFullYear()} ArtSense · Artwork Classification Technology
        </div>
      </footer>
    </div>
  );
};
