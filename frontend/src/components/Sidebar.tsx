"use client";

import { useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import Link from "next/link";

// Sample data with timestamps for PDF history
const sidebarItems = [
  { title: "First PDF", href: "/first", timestamp: "2025-03-20 12:30 PM" },
  { title: "Second PDF", href: "/second", timestamp: "2025-03-19 03:15 PM" },
  { title: "Third PDF", href: "/third", timestamp: "2025-03-18 11:00 AM" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-[#222327] text-[#D9D9D9] transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <div className="p-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#D9D9D9] p-1 rounded-md hover:bg-[#2A2B32] transition ease-in-out focus:outline-none w-full flex justify-end"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Title/Heading */}
        {isOpen && (
          <div className="px-4 py-2">
            <h1 className="text-lg font-normal text-[#D9D9D9]">Uploaded PDFs</h1>
          </div>
        )}

        {/* Navigation */}
        <nav>
          <ul className="space-y-1">
            {sidebarItems.map(({ title, href, timestamp }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2 p-2 mx-2 rounded-md hover:bg-[#2A2B32] transition ease-in-out"
                >
                  <FileText size={16} className="text-[#D9D9D9]" />
                  {isOpen && (
                    <div>
                      <span className="text-sm">{title}</span>
                      <p className="text-xs text-[#8E8EA0]">{timestamp}</p>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}