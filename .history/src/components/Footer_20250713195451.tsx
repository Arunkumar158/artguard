import React from "react";

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "FAQ", href: "/faq" },
      { name: "Help & Feedback", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "/privacy-policy" },
      { name: "Terms", href: "/terms-of-service" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#FFF4F0] border-t border-neutral-200 py-8 mt-8 text-neutral-700 text-sm">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Brand/Left Side */}
        <div className="mb-6 md:mb-0 flex flex-col gap-2 md:col-span-1">
          <h2 className="text-xl font-bold tracking-tight">ArtGuard</h2>
          <span className="text-xs text-neutral-500">Crafted for artists. Powered by AI.</span>
          <span className="text-xs text-neutral-400 mt-2">© 2025 ArtGuard, All rights reserved</span>
          <a href="/test" className="text-xs text-blue-500 underline mt-2">Test Link</a>
        </div>
        {/* 3 Columns */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {footerLinks.map((col) => (
            <div key={col.title}>
              <div className="font-semibold mb-2 text-neutral-800">{col.title}</div>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="hover:underline transition-colors duration-150"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
} 