import React from 'react';
import Link from 'next/link';

type NavItemProps = {
  item: { 
    label: string; 
    href: string; 
    icon: React.ReactNode 
  };
  active: boolean;
};

export default function NavItem({ item, active }: NavItemProps) {
  return (
    <li>
      <Link href={item.href}>
        <div
          className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors duration-200 ${
            active 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <span className={`mr-3 ${active ? 'text-white' : 'text-slate-400'}`}>
            {item.icon}
          </span>
          <span>{item.label}</span>
          {active && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-300"></span>
          )}
        </div>
      </Link>
    </li>
  );
}