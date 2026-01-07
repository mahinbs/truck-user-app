import React from 'react';
import { useRouter } from 'next/router';
import { FiGrid, FiPackage, FiUser } from 'react-icons/fi';
import { SafeIcon } from './ui/SafeIcon';
import { colors } from '../constants/theme';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: FiGrid },
  { path: '/trips', label: 'Shipments', icon: FiPackage },
  { path: '/profile', label: 'Profile', icon: FiUser },
];

export const BottomNav: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-backgroundCard border-t border-border pt-2 pb-2 flex justify-around items-center z-[1000] shadow-lg">
      {navItems.map((item) => {
        const isActive = router.pathname === item.path || router.pathname.startsWith(item.path + '/');
        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer px-4 py-2 transition-colors ${
              isActive ? 'text-primary' : 'text-text-secondary'
            }`}
          >
            <SafeIcon Icon={item.icon} size={24} color={isActive ? colors.primary : colors.textSecondary} />
            <span className={`text-xs ${isActive ? 'font-semibold' : 'font-normal'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

