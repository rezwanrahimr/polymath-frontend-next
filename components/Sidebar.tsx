<<<<<<< HEAD
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import OverviewIcon from './icons/Overview';
import Content from './icons/Content';
import Keywords from './icons/Keywords';
import History from './icons/History';
import Settings from './icons/Settings';
=======
"use client";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Content from "./icons/Content";
import History from "./icons/History";
import Keywords from "./icons/Keywords";
import OverviewIcon from "./icons/Overview";
import Settings from "./icons/Settings";
>>>>>>> f332c85 (set swr)

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  // navItems same as before
  const navItems: NavItem[] = [
    {
<<<<<<< HEAD
      id: 'overview',
      label: 'Overview',
      icon: (
        <OverviewIcon isActive={pathname === '/dashboard' || pathname.startsWith('/dashboard/overview')} />
      ),
      href: '/dashboard'
    },
    {
      id: 'content',
      label: 'Content',
      icon: (
        <Content isActive={pathname === '/dashboard/content'} />
      ),
      href: '/dashboard/content'
    },
    {
      id: 'keywords',
      label: 'Keywords',
      icon: <Keywords isActive={pathname === '/dashboard/keywords'} />,
      href: '/dashboard/keywords'
    },
    {
      id: 'history',
      label: 'History',
      icon: <History isActive={pathname === '/dashboard/history'} />,
      href: '/dashboard/history'
    },
    {
      id: 'setting',
      label: 'Setting',
      icon: <Settings isActive={pathname === '/dashboard/settings'} />,
      href: '/dashboard/settings'
    }
=======
      id: "overview",
      label: "Overview",
      icon: (
        <OverviewIcon
          isActive={
            pathname === "/dashboard" ||
            pathname.startsWith("/dashboard/overview")
          }
        />
      ),
      href: "/dashboard",
    },
    {
      id: "content",
      label: "Content",
      icon: <Content isActive={pathname === "/dashboard/content"} />,
      href: "/dashboard/content",
    },
    {
      id: "keywords",
      label: "Keywords",
      icon: <Keywords isActive={pathname === "/dashboard/keywords"} />,
      href: "/dashboard/keywords",
    },
    {
      id: "history",
      label: "History",
      icon: <History isActive={pathname === "/dashboard/history"} />,
      href: "/dashboard/history",
    },
    {
      id: "setting",
      label: "Setting",
      icon: <Settings isActive={pathname === "/dashboard/settings"} />,
      href: "/dashboard/settings",
    },
>>>>>>> f332c85 (set swr)
  ];

  // Function to check if a nav item is active
  const isActive = (href: string) => {
<<<<<<< HEAD
    return pathname === href ||
      (href !== '/dashboard' && pathname.startsWith(href));
=======
    return (
      pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
    );
>>>>>>> f332c85 (set swr)
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
<<<<<<< HEAD
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
=======
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
>>>>>>> f332c85 (set swr)
        onClick={onClose}
      ></div>

      <aside
        className={`
          fixed z-50 top-0 left-0 h-full w-[230px] bg-[#003D3D] flex flex-col rounded-r-[30px]
          transform transition-transform duration-300
<<<<<<< HEAD
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
=======
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
>>>>>>> f332c85 (set swr)
          md:translate-x-0 md:static
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b-[2px] border-white/24 h-[110px] flex justify-between items-center">
<<<<<<< HEAD
          <Link href="/dashboard">   <Image src="/images/logo.png" alt="Polymath Logo" width={188} height={46} />
          </Link>
          {/* Close button for mobile */}
          <button onClick={onClose} className="ms-4 md:ms-0 md:hidden text-white">
=======
          <Link href="/dashboard">
            {" "}
            <Image
              src="/images/logo.png"
              alt="Polymath Logo"
              width={188}
              height={46}
            />
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="text-white ms-4 md:ms-0 md:hidden"
          >
>>>>>>> f332c85 (set swr)
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-[24px] overflow-y-auto">
<<<<<<< HEAD
          <ul className="space-y-2 px-4">
=======
          <ul className="px-4 space-y-2">
>>>>>>> f332c85 (set swr)
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
<<<<<<< HEAD
                    ${isActive(item.href)
                      ? 'text-black'
                      : 'text-teal-200 hover:bg-teal-700 text-white'}
                  `}
                  style={isActive(item.href) ? { background: 'linear-gradient(to right, #00FF7F, #00C260)' } : {}}
=======
                    ${
                      isActive(item.href)
                        ? "text-black"
                        : "text-teal-200 hover:bg-teal-700 text-white"
                    }
                  `}
                  style={
                    isActive(item.href)
                      ? {
                          background:
                            "linear-gradient(to right, #00FF7F, #00C260)",
                        }
                      : {}
                  }
>>>>>>> f332c85 (set swr)
                >
                  {item.icon}
                  <span className="text-[18px] font-normal">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

<<<<<<< HEAD
export default Sidebar;
=======
export default Sidebar;
>>>>>>> f332c85 (set swr)
