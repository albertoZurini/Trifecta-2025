'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardIcon,
  PlusIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/workflows', icon: <ClipboardIcon className="w-5 h-5" />, label: 'Workflows' },
    { href: '/workflows/create', icon: <PlusIcon className="w-5 h-5" />, label: 'Create Workflow' },
    { href: '/analytics', icon: <ChartBarIcon className="w-5 h-5" />, label: 'Analytics' },
    { href: '/settings', icon: <Cog6ToothIcon className="w-5 h-5" />, label: 'Settings' }
  ];

  return (
    <div className="w-64 bg-[#1f2027] h-screen fixed left-0 border-r border-gray-800">
      <Link href="/" className="flex items-center gap-2 p-4 border-b border-gray-800">
        <Image
          src="/avatar.jpg"
          alt="Financial AI"
          width={256}
          height={256}
          className="rounded-full"
        />

      </Link>

      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-gray-400 hover:text-purple-500 hover:bg-[#2a2b36]">
              <HomeIcon className="w-5 h-5" />
              Home
            </Link>
          </li>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname === item.href
                  ? 'text-purple-500 bg-purple-600/20'
                  : 'text-gray-400 hover:text-purple-500 hover:bg-[#2a2b36]'
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar; 
