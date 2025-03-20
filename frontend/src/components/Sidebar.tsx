"use client";

import { useState } from "react";
import { Home, LayoutDashboard, Settings, Menu, X } from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Home", href: "/home", icon: Home },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-900 text-white p-5 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 rounded-md mb-4 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation */}
        <nav>
          <ul>
            {sidebarItems.map(({ name, href, icon: Icon }) => (
              <li key={name} className="mb-2">
                <Link
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition"
                >
                  <Icon className="w-5 h-5" />
                  {isOpen && <span>{name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
