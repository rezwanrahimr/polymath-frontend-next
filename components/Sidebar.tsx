'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation'; // Add this import

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
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 18.5C2 16.9596 2 16.1893 2.34673 15.6235C2.54074 15.3069 2.80693 15.0407 3.12353 14.8467C3.68934 14.5 4.45956 14.5 6 14.5C7.54044 14.5 8.31066 14.5 8.87647 14.8467C9.19307 15.0407 9.45926 15.3069 9.65327 15.6235C10 16.1893 10 16.9596 10 18.5C10 20.0404 10 20.8107 9.65327 21.3765C9.45926 21.6931 9.19307 21.9593 8.87647 22.1533C8.31066 22.5 7.54044 22.5 6 22.5C4.45956 22.5 3.68934 22.5 3.12353 22.1533C2.80693 21.9593 2.54074 21.6931 2.34673 21.3765C2 20.8107 2 20.0404 2 18.5Z" stroke="#0D1117" stroke-width="1.5" />
          <path d="M14 18.5C14 16.9596 14 16.1893 14.3467 15.6235C14.5407 15.3069 14.8069 15.0407 15.1235 14.8467C15.6893 14.5 16.4596 14.5 18 14.5C19.5404 14.5 20.3107 14.5 20.8765 14.8467C21.1931 15.0407 21.4593 15.3069 21.6533 15.6235C22 16.1893 22 16.9596 22 18.5C22 20.0404 22 20.8107 21.6533 21.3765C21.4593 21.6931 21.1931 21.9593 20.8765 22.1533C20.3107 22.5 19.5404 22.5 18 22.5C16.4596 22.5 15.6893 22.5 15.1235 22.1533C14.8069 21.9593 14.5407 21.6931 14.3467 21.3765C14 20.8107 14 20.0404 14 18.5Z" stroke="#0D1117" stroke-width="1.5" />
          <path d="M2 6.5C2 4.95956 2 4.18934 2.34673 3.62353C2.54074 3.30693 2.80693 3.04074 3.12353 2.84673C3.68934 2.5 4.45956 2.5 6 2.5C7.54044 2.5 8.31066 2.5 8.87647 2.84673C9.19307 3.04074 9.45926 3.30693 9.65327 3.62353C10 4.18934 10 4.95956 10 6.5C10 8.04044 10 8.81066 9.65327 9.37647C9.45926 9.69307 9.19307 9.95926 8.87647 10.1533C8.31066 10.5 7.54044 10.5 6 10.5C4.45956 10.5 3.68934 10.5 3.12353 10.1533C2.80693 9.95926 2.54074 9.69307 2.34673 9.37647C2 8.81066 2 8.04044 2 6.5Z" stroke="#0D1117" stroke-width="1.5" />
          <path d="M14 6.5C14 4.95956 14 4.18934 14.3467 3.62353C14.5407 3.30693 14.8069 3.04074 15.1235 2.84673C15.6893 2.5 16.4596 2.5 18 2.5C19.5404 2.5 20.3107 2.5 20.8765 2.84673C21.1931 3.04074 21.4593 3.30693 21.6533 3.62353C22 4.18934 22 4.95956 22 6.5C22 8.04044 22 8.81066 21.6533 9.37647C21.4593 9.69307 21.1931 9.95926 20.8765 10.1533C20.3107 10.5 19.5404 10.5 18 10.5C16.4596 10.5 15.6893 10.5 15.1235 10.1533C14.8069 9.95926 14.5407 9.69307 14.3467 9.37647C14 8.81066 14 8.04044 14 6.5Z" stroke="#0D1117" stroke-width="1.5" />
        </svg>

      ),
      href: '/dashboard'
    },
    {
      id: 'content',
      label: 'Content',
      icon: (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.5995 19.4737L7.63427 20.7672C6.2983 21.0153 5.63031 21.1393 5.24549 20.7545C4.86067 20.3697 4.98471 19.7016 5.2328 18.3656L6.52621 11.4001C6.73362 10.2831 6.83732 9.72463 7.20549 9.38719C7.57365 9.04975 8.24697 8.98389 9.59359 8.85218C10.8915 8.72524 12.1197 8.28032 13.4 7L19 12.6005C17.7197 13.8808 17.2746 15.1083 17.1474 16.4062C17.0155 17.753 16.9495 18.4264 16.6121 18.7945C16.2747 19.1626 15.7163 19.2663 14.5995 19.4737Z" stroke="#00FFFF" stroke-width="1.5" stroke-linejoin="round" />
          <path d="M13 15.2105C12.4405 15.1197 11.9289 14.8763 11.5263 14.4737M11.5263 14.4737C11.1237 14.0711 10.8803 13.5595 10.7895 13M11.5263 14.4737L6 20" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" />
          <path d="M13.5 7C14.1332 6.06586 15.4907 4.16107 16.7613 4.00976C17.6287 3.90648 18.3472 4.62499 19.7842 6.06202L19.938 6.2158C21.375 7.65283 22.0935 8.37135 21.9902 9.23867C21.8389 10.5092 19.9341 11.8668 19 12.5" stroke="#00FFFF" stroke-width="1.5" stroke-linejoin="round" />
          <path d="M2 4H8" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" />
        </svg>

      ),
      href: '/dashboard/content'
    },
    {
      id: 'keywords',
      label: 'Keywords',
      icon: (
        <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 6.5H8.5C5.21252 6.5 3.56878 6.5 2.46243 7.40796C2.25989 7.57418 2.07418 7.75989 1.90796 7.96243C1 9.06878 1 10.7125 1 14C1 17.2875 1 18.9312 1.90796 20.0376C2.07418 20.2401 2.25989 20.4258 2.46243 20.592C3.56878 21.5 5.21252 21.5 8.5 21.5H13.5C16.7875 21.5 18.4312 21.5 19.5376 20.592C19.7401 20.4258 19.9258 20.2401 20.092 20.0376C21 18.9312 21 17.2875 21 14C21 10.7125 21 9.06878 20.092 7.96243C19.9258 7.75989 19.7401 7.57418 19.5376 7.40796C18.4312 6.5 16.7875 6.5 13.5 6.5Z" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" />
          <path d="M11 6.5V4.5C11 3.94772 11.4477 3.5 12 3.5C12.5523 3.5 13 3.05228 13 2.5V1.5" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M6 11.5L7 11.5" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M10.5 11.5L11.5 11.5" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15 11.5L16 11.5" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M6 16.5L16 16.5" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

      ),
      href: '/dashboard/keywords'
    },
    {
      id: 'history',
      label: 'History',
      icon: (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22.5C6.47711 22.5 2 18.0228 2 12.5C2 6.97715 6.47715 2.5 12 2.5C16.4776 2.5 20.2257 5.44289 21.5 9.5H19" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 8.5V12.5L14 14.5" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M21.9551 13.5C21.9848 13.1709 22 12.8373 22 12.5M15 22.5C15.3416 22.3876 15.6753 22.2564 16 22.1078M20.7906 17.5C20.9835 17.1284 21.1555 16.7433 21.305 16.3462M18.1925 20.7292C18.5369 20.4441 18.8631 20.1358 19.1688 19.8065" stroke="#00FFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

      ),
      href: '/dashboard/history'
    },
    {
      id: 'setting',
      label: 'Setting',
      icon: (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 18.5C2 16.9596 2 16.1893 2.34673 15.6235C2.54074 15.3069 2.80693 15.0407 3.12353 14.8467C3.68934 14.5 4.45956 14.5 6 14.5C7.54044 14.5 8.31066 14.5 8.87647 14.8467C9.19307 15.0407 9.45926 15.3069 9.65327 15.6235C10 16.1893 10 16.9596 10 18.5C10 20.0404 10 20.8107 9.65327 21.3765C9.45926 21.6931 9.19307 21.9593 8.87647 22.1533C8.31066 22.5 7.54044 22.5 6 22.5C4.45956 22.5 3.68934 22.5 3.12353 22.1533C2.80693 21.9593 2.54074 21.6931 2.34673 21.3765C2 20.8107 2 20.0404 2 18.5Z" stroke="#00FFFF" stroke-width="1.5" />
          <path d="M14 18.5C14 16.9596 14 16.1893 14.3467 15.6235C14.5407 15.3069 14.8069 15.0407 15.1235 14.8467C15.6893 14.5 16.4596 14.5 18 14.5C19.5404 14.5 20.3107 14.5 20.8765 14.8467C21.1931 15.0407 21.4593 15.3069 21.6533 15.6235C22 16.1893 22 16.9596 22 18.5C22 20.0404 22 20.8107 21.6533 21.3765C21.4593 21.6931 21.1931 21.9593 20.8765 22.1533C20.3107 22.5 19.5404 22.5 18 22.5C16.4596 22.5 15.6893 22.5 15.1235 22.1533C14.8069 21.9593 14.5407 21.6931 14.3467 21.3765C14 20.8107 14 20.0404 14 18.5Z" stroke="#00FFFF" stroke-width="1.5" />
          <path d="M2 6.5C2 4.95956 2 4.18934 2.34673 3.62353C2.54074 3.30693 2.80693 3.04074 3.12353 2.84673C3.68934 2.5 4.45956 2.5 6 2.5C7.54044 2.5 8.31066 2.5 8.87647 2.84673C9.19307 3.04074 9.45926 3.30693 9.65327 3.62353C10 4.18934 10 4.95956 10 6.5C10 8.04044 10 8.81066 9.65327 9.37647C9.45926 9.69307 9.19307 9.95926 8.87647 10.1533C8.31066 10.5 7.54044 10.5 6 10.5C4.45956 10.5 3.68934 10.5 3.12353 10.1533C2.80693 9.95926 2.54074 9.69307 2.34673 9.37647C2 8.81066 2 8.04044 2 6.5Z" stroke="#00FFFF" stroke-width="1.5" />
          <path d="M14 6.5C14 4.95956 14 4.18934 14.3467 3.62353C14.5407 3.30693 14.8069 3.04074 15.1235 2.84673C15.6893 2.5 16.4596 2.5 18 2.5C19.5404 2.5 20.3107 2.5 20.8765 2.84673C21.1931 3.04074 21.4593 3.30693 21.6533 3.62353C22 4.18934 22 4.95956 22 6.5C22 8.04044 22 8.81066 21.6533 9.37647C21.4593 9.69307 21.1931 9.95926 20.8765 10.1533C20.3107 10.5 19.5404 10.5 18 10.5C16.4596 10.5 15.6893 10.5 15.1235 10.1533C14.8069 9.95926 14.5407 9.69307 14.3467 9.37647C14 8.81066 14 8.04044 14 6.5Z" stroke="#00FFFF" stroke-width="1.5" />
        </svg>

      ),
      href: '/dashboard/settings'
    }
  ];

  // Function to check if a nav item is active
  const isActive = (href: string) => {
    return pathname === href ||
      (href !== '/dashboard' && pathname.startsWith(href));
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <aside
        className={`
          fixed z-50 top-0 left-0 h-full w-[271px] bg-[#003D3D] flex flex-col rounded-r-[30px]
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b-[2px] border-white/24 h-[110px] flex justify-between items-center">
          <Link href="/dashboard">   <Image src="/images/logo.png" alt="Polymath Logo" width={188} height={46} />
          </Link>
          {/* Close button for mobile */}
          <button onClick={onClose} className="md:hidden text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-[24px] overflow-y-auto">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${isActive(item.href)
                      ? 'text-black'
                      : 'text-teal-200 hover:bg-teal-700 text-white'}
                  `}
                  style={isActive(item.href) ? { background: 'linear-gradient(to right, #00FF7F, #00C260)' } : {}}
                >
                  {item.icon}
                  <span className="text-[20px] font-normal">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;