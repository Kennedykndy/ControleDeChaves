/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

import { ScreenType, TransitionType, UserAccount } from "../types";
import {
  LayoutDashboard,
  Users,
  Key,
  BarChart3,
  History,
  Compass,
  Power,
} from "lucide-react";
import "lucide-react";

interface SidebarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  currentUser?: UserAccount;
  onLogout?: () => void;
}

export default function Sidebar({
  currentScreen,
  onNavigate,
  currentUser,
  onLogout,
}: SidebarProps) {
  // Navigation mapping helper to respect the transition rules
  const handleNavClick = (target: ScreenType) => {
    if (target === currentScreen) return;

    let transition: TransitionType = "none";

    if (currentScreen === "dashboard") {
      if (target === "add-employee") transition = "push";
      else if (target === "add-key") transition = "push";
      else if (target === "reports") transition = "push";
    } else if (currentScreen === "reports") {
      if (target === "dashboard") transition = "push_back";
      else if (target === "add-employee") transition = "none";
      else if (target === "add-key") transition = "none";
    } else if (currentScreen === "add-employee") {
      if (target === "dashboard") transition = "push_back";
      else if (target === "add-key") transition = "none";
    } else if (currentScreen === "add-key") {
      if (target === "dashboard") transition = "push_back";
      else if (target === "add-employee") transition = "none";
      else if (target === "reports") transition = "none";
    }

    onNavigate(target, transition);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex flex-col w-[260px] h-screen border-r border-slate-800 bg-slate-900 shadow-xl transition-all duration-300">
      {/* Profile Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm p-1.5 overflow-hidden">
          <img
            src="https://seeklogo.com/images/S/senac-logo-1041102B11-seeklogo.com.png"
            alt="SENAC"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h2 className="text-base font-bold text-white leading-none tracking-tight">
            SENAC
          </h2>
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#F47A20] mt-1">
            Agreste
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-1.5 px-4 overflow-y-auto">
        {/* Painel de Controle */}
        <button
          onClick={() => handleNavClick("dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 cursor-pointer ${
            currentScreen === "dashboard"
              ? "bg-blue-600/10 text-blue-400 font-semibold border-l-4 border-blue-500"
              : "text-slate-400 hover:text-white hover:bg-slate-850/50"
          }`}
        >
          <LayoutDashboard
            size={18}
            className={
              currentScreen === "dashboard" ? "text-blue-400" : "text-slate-450"
            }
          />
          <span className="text-sm font-medium">Painel de Controle</span>
        </button>

        {/* Funcionários */}
        <button
          onClick={() => handleNavClick("employees")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 cursor-pointer ${
            currentScreen === "employees"
              ? "bg-blue-600/10 text-blue-400 font-semibold border-l-4 border-blue-500"
              : "text-slate-400 hover:text-white hover:bg-slate-850/50"
          }`}
        >
          <Users
            size={18}
            className={
              currentScreen === "employees" ? "text-blue-400" : "text-slate-450"
            }
          />
          <span className="text-sm font-medium">Funcionários</span>
        </button>

        {/* Novo Funcionário */}
        <button
          onClick={() => handleNavClick("add-employee")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 cursor-pointer ${
            currentScreen === "add-employee"
              ? "bg-blue-600/10 text-blue-400 font-semibold border-l-4 border-blue-500"
              : "text-slate-400 hover:text-white hover:bg-slate-850/50"
          }`}
        >
          <Users
            size={18}
            className={
              currentScreen === "add-employee"
                ? "text-blue-400"
                : "text-slate-450"
            }
          />
          <span className="text-sm font-medium">Novo Funcionário</span>
        </button>

        {/* Chaves e Ambientes */}
        <button
          onClick={() => handleNavClick("add-key")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 cursor-pointer ${
            currentScreen === "add-key"
              ? "bg-blue-600/10 text-blue-400 font-semibold border-l-4 border-blue-500"
              : "text-slate-400 hover:text-white hover:bg-slate-850/50"
          }`}
        >
          <Key
            size={18}
            className={
              currentScreen === "add-key" ? "text-blue-400" : "text-slate-450"
            }
          />
          <span className="text-sm font-medium">Chaves e Ambientes</span>
        </button>

        {/* Relatórios */}
        <button
          onClick={() => handleNavClick("reports")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 cursor-pointer ${
            currentScreen === "reports"
              ? "bg-blue-600/10 text-blue-400 font-semibold border-l-4 border-blue-500"
              : "text-slate-400 hover:text-white hover:bg-slate-850/50"
          }`}
        >
          <BarChart3
            size={18}
            className={
              currentScreen === "reports" ? "text-blue-400" : "text-slate-450"
            }
          />
          <span className="text-sm font-medium">Relatórios</span>
        </button>

        {/* Histórico */}
        <button
          onClick={() => handleNavClick("reports")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850/50 transition-all duration-150 cursor-pointer"
        >
          <History size={18} className="text-slate-450" />
          <span className="text-sm font-medium">Histórico</span>
        </button>

        {/* Acompanhamento */}
        <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 cursor-not-allowed opacity-40">
          <Compass size={18} />
          <span className="text-sm font-medium">Acompanhamento</span>
        </div>
      </nav>

      {/* Meta Text Footer */}
      <div className="p-4 border-t border-slate-850 bg-slate-950/20">
        <div className="flex items-center gap-3 justify-between mb-2 p-1">
          <div className="flex items-center gap-2 max-w-[170px] overflow-hidden">
            {currentUser?.profilePicture ? (
              <div className="w-8 h-8 rounded-full border border-slate-700 overflow-hidden flex-shrink-0">
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white uppercase flex-shrink-0">
                {currentUser ? currentUser.fullName.slice(0, 2) : "AD"}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser?.fullName || "Adm. Agreste"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentUser?.email || "admin@al.senac.br"}
              </p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
              title="Sair do Sistema"
            >
              <Power size={14} />
            </button>
          )}
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-850 pt-2 px-1">
          <span>v1.0.4</span>
          <span className="flex items-center gap-1">Conexão Segura</span>
        </div>
      </div>
    </aside>
  );
}
