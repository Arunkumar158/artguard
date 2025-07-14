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
    <footer className="bg-[#FFF4F0] border-t border-neutral-200 py-8 mt-8 text-neutral-700 text-sm md:text-base">
      <div className="max-w-6xl mx-auto px-4 md:px-4">
        <div className="flex flex-col md:grid md:grid-cols-4 gap-6 md:gap-6 py-4 px-4 md:p-0">
          {/* Brand/Left Side */}
          <div className="mb-6 md:mb-0 flex flex-col gap-2 md:col-span-1">
            <h2 className="text-xl font-bold tracking-tight">ArtGuard</h2>
            <span className="text-xs text-neutral-500">Crafted for artists. Powered by AI.</span>
            <span className="text-xs text-neutral-400 mt-2">© 2025 ArtGuard, All rights reserved</span>
            <a href="/test" className="text-xs text-blue-500 underline mt-2">Test Link</a>
          </div>
          {/* 3 Columns */}
          <div className="flex flex-col space-y-3 md:space-y-0 md:grid md:grid-cols-3 gap-6 md:col-span-3">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <div className="font-semibold mb-2 text-neutral-800">{col.title}</div>
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="block md:inline-block w-full md:w-auto px-2 py-2 md:px-0 md:py-0 rounded transition-colors duration-150 hover:underline hover:bg-[#FF7F50]/10 focus:bg-[#FF7F50]/20 focus:outline-none text-neutral-700"
                        style={{ minWidth: 0 }}
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
      </div>
    </footer>
  );
} 