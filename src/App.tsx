import React from 'react';

// 1. قم بتعريف الـ Interface للخصائص
interface HeaderProps {
  currentTab: 'send' | 'history';
  setCurrentTab: (tab: 'send' | 'history') => void;
}

// 2. قم بتطبيقها على المكون
export function Header({ currentTab, setCurrentTab }: HeaderProps) {
  return (
    <header>
      {/* محتوى الـ Header */}
    </header>
  );
}