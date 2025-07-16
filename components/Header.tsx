import React, { useState } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const path = usePathname();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const getHeaderName = () => {
    switch (path) {
      case '/dashboard/content':
        return 'Content';
      case '/dashboard/analytics':
        return 'Analytics';
      case '/dashboard/keywords':
        return 'Keyword Research with AI';
      case '/dashboard/settings':
        return 'Settings';
      default:
        return 'Overview';
    }
  }

  return (
    <header className="h-[110px] px-6 py-4 flex items-center justify-between border-b border-gray-600 relative">
      {/* Hamburger on mobile */}
      <div className="flex items-center space-x-3">
        <button onClick={onMenuClick} className="md:hidden text-white">
          <Menu size={28} />
        </button>
        <h1 className="text-[32px] font-semibold text-white">{getHeaderName()}</h1>
      </div>

      {/* User profile */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-10 h-10 bg-gray-600 rounded-full overflow-hidden">
              <Image
                src="/api/placeholder/40/40"
                alt="User Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[#00FFFF] text-[24px] font-normal">Shivamo</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Updated Profile dropdown to match the image */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-[234px] bg-gray-400 rounded-md shadow-lg py-1 z-50 border border-gray-600">
              <div className="px-4 py-4 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-600 rounded-full overflow-hidden mb-3">
                  <Image
                    src="/api/placeholder/64/64"
                    alt="User Avatar"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-black text-lg font-medium">Shivamo</p>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-gray-400 text-sm mt-4">Mail</p>
              </div>
              <div className="border-t border-gray-600 my-2"></div>
              <div className="px-4 py-2">
                <button className="block w-full text-left py-2 text-white hover:bg-gray-700 rounded">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;