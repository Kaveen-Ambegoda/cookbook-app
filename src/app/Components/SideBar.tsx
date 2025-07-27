'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaUsers,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen?: boolean;
}

export default function Sidebar({ isOpen = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [pathname]); // Re-check when pathname changes

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/Pages/Login_Register/Login');
  };

  // Navigation items
  const navigationItems = [
    { 
      icon: FaHome, 
      path: '/', 
      label: 'Home',
      authRequired: false 
    },
    { 
      icon: FaUtensils, 
      path: '/recipes', 
      label: 'Recipes',
      authRequired: false 
    },
    { 
      icon: FaUsers, 
      path: '/community', 
      label: 'Community',
      authRequired: true // Require authentication for community
    },
    { 
      icon: FaClipboardList, 
      path: '/meal-plans', 
      label: 'Meal Plans',
      authRequired: false 
    },
    { 
      icon: FaHeart, 
      path: '/favorites', 
      label: 'Favorites',
      authRequired: false 
    },
    { 
      icon: FaCog, 
      path: '/settings', 
      label: 'Settings',
      authRequired: false 
    },
  ];

  // Don't show sidebar on login/register pages
  if (pathname?.toLowerCase().startsWith('/pages/login_register')) {
    return null;
  }

  const handleNavigation = (path: string, authRequired: boolean) => {
    // If trying to access auth-required page and not authenticated, redirect to login
    if (authRequired && !isAuthenticated) {
      router.push('/Pages/Login_Register/Login');
      return;
    }
    router.push(path);
  };

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`bg-green-800 text-white fixed top-0 left-0 h-full flex flex-col items-center py-20 space-y-4 transition-all duration-300 z-20 ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || 
            (item.path === '/community' && pathname === '/community');
          
          return (
            <div key={index} className="relative group w-full">
              <button
                onClick={() => handleNavigation(item.path, item.authRequired)}
                className={`w-full p-3 rounded-lg transition-all duration-300 hover:bg-green-700 hover:scale-105 flex items-center ${
                  isActive ? 'bg-yellow-400 text-green-800' : ''
                } ${isOpen ? 'justify-start px-4' : 'justify-center'}`}
                title={item.label}
              >
                <Icon size={24} />
                
                {/* Label for expanded sidebar */}
                {isOpen && (
                  <span className="ml-4 text-sm font-medium whitespace-nowrap">
                    {item.label}
                    {item.authRequired && !isAuthenticated && (
                      <span className="ml-2 text-xs text-yellow-200">(Login required)</span>
                    )}
                  </span>
                )}
              </button>
              
              {/* Tooltip for collapsed sidebar */}
              {!isOpen && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                  {item.label}
                  {item.authRequired && !isAuthenticated && (
                    <div className="text-xs text-yellow-200">(Login required)</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Spacer */}
        <div className="flex-1"></div>
        
        {/* Logout button */}
        {isAuthenticated ? (
          <div className="relative group w-full">
            <button
              onClick={handleLogout}
              className={`w-full p-3 rounded-lg transition-all duration-300 hover:bg-red-600 hover:scale-105 flex items-center ${
                isOpen ? 'justify-start px-4' : 'justify-center'
              }`}
              title="Sign Out"
            >
              <FaSignOutAlt size={24} />
              
              {/* Label for expanded sidebar */}
              {isOpen && (
                <span className="ml-4 text-sm font-medium whitespace-nowrap">
                  Sign Out
                </span>
              )}
            </button>
            
            {/* Tooltip for collapsed sidebar */}
            {!isOpen && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                Sign Out
              </div>
            )}
          </div>
        ) : (
          <div className="relative group w-full">
            <button
              onClick={() => router.push('/Pages/Login_Register/Login')}
              className={`w-full p-3 rounded-lg transition-all duration-300 hover:bg-blue-600 hover:scale-105 flex items-center ${
                isOpen ? 'justify-start px-4' : 'justify-center'
              }`}
              title="Sign In"
            >
              <FaSignOutAlt size={24} className="rotate-180" />
              
              {/* Label for expanded sidebar */}
              {isOpen && (
                <span className="ml-4 text-sm font-medium whitespace-nowrap">
                  Sign In
                </span>
              )}
            </button>
            
            {/* Tooltip for collapsed sidebar */}
            {!isOpen && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                Sign In
              </div>
            )}
          </div>
        )}
      </aside>
      
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => {}} // Handle closing sidebar if needed
        />
      )}
    </>
  );
}