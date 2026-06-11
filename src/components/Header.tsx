/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  userFullName?: string;
  userRole?: string;
  profilePicture?: string;
}

export default function Header({ title, userFullName = 'Admin User', userRole = 'Diretoria', profilePicture }: HeaderProps) {
  return (
    <header className="sticky top-0 right-0 z-30 flex justify-between items-center px-8 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="flex items-center gap-4">
        <Menu className="text-slate-800 cursor-pointer hover:bg-slate-100 p-1.5 rounded-full w-8 h-8 transition-all" />
        <h1 className="text-lg font-bold text-slate-800 leading-none tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block group">
          <input
            className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 w-64 transition-all duration-200"
            placeholder="Buscar recursos ou chaves..."
            type="text"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="flex flex-col items-end text-right hidden lg:flex">
            <span className="text-xs font-semibold text-slate-800 leading-tight">{userFullName}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{userRole}</span>
          </div>
          <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden cursor-pointer shadow-sm flex items-center justify-center bg-slate-100">
            {profilePicture ? (
              <img
                className="w-full h-full object-cover"
                alt="Profile avatar"
                referrerPolicy="no-referrer"
                src={profilePicture}
              />
            ) : (
              <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs select-none">
                {userFullName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
