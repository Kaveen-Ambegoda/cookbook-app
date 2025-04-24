import Link from 'next/link';
import React from 'react';

type NavItemProps = {
  item: { label: string; href: string; icon: React.ReactNode };
  active: boolean;
};

export default function NavItem({ item, active }: NavItemProps) {
  return (
    <li>
      <Link href={item.href}>
        <div
          className={`flex items-center px-4 py-3 text-sm rounded-md ${
            active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="mr-3">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      </Link>
    </li>
  );
}
