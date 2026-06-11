/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, TransitionType, ActivityLog, Environment, UserAccount } from '../types';
import Sidebar from './Sidebar';
import Header from './Header';
import { Calendar, Filter, Download, AlertTriangle, Play, CheckCircle, BarChart, FileText, Key } from 'lucide-react';

interface ReportsScreenProps {
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  environments: Environment[];
  logs: ActivityLog[];
  setLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  currentUser?: UserAccount;
  onLogout: () => void;
}

export default function ReportsScreen({
  onNavigate,
  environments,
  logs,
  setLogs,
  currentUser,
  onLogout,
}: ReportsScreenProps) {
  const [selectedAction, setSelectedAction] = useState('Todas as Ações');
  const [selectedSector, setSelectedSector] = useState('Todos os Setores');
  const [dateConstraint, setDateConstraint] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logs berdasarkan kriteria yang dipilih user secara interaktif
  const filteredLogs = logs.filter((log) => {
    // Action filter
    if (selectedAction !== 'Todas as Ações') {
      if (selectedAction === 'Retirada de Chave' && log.action !== 'Retirada de Chave') return false;
      if (selectedAction === 'Devolução de Chave' && log.action !== 'Devolução') return false;
      if (selectedAction === 'Acesso Bloqueado' && log.action !== 'Tentativa Negada') return false;
    }

    // Sector/Building filter (derived from mock resources or block)
    if (selectedSector !== 'Todos os Setores') {
      if (selectedSector === 'Laboratórios de Informática' && !log.resource.toLowerCase().includes('lab')) return false;
      if (selectedSector === 'Salas de Aula - Bloco A' && !log.resource.toLowerCase().includes('bloco a') && !log.resource.toLowerCase().includes('sala')) return false;
      if (selectedSector === 'Administrativo' && !log.resource.toLowerCase().includes('auditório') && !log.resource.toLowerCase().includes('cpd')) return false;
    }

    // Query search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.resource.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q)
      );
    }

    return true;
  });

  // Calculate current active occupied keys
  const activeOccupants = environments.filter((env) => env.status === 'Ocupado');

  const handleExport = () => {
    alert('Relatório exportado em formato CSV com sucesso!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="reports" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} />

      {/* Main Column */}
      <div className="pl-[260px] min-h-screen flex flex-col">
        {/* Top Header bar */}
        <Header title="Relatórios & Auditoria" userFullName={currentUser?.fullName} profilePicture={currentUser?.profilePicture} />

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
          {/* Controls Filters Grid */}
          <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Período</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-205 rounded-lg text-xs focus:outline-none focus:border-blue-600 bg-slate-50/20"
                  type="date"
                  value={dateConstraint}
                  onChange={(e) => setDateConstraint(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tipo de Ação</label>
              <select
                className="border border-slate-205 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-blue-600 bg-slate-50/20 text-slate-700"
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
              >
                <option value="Todas as Ações">Todas as Ações</option>
                <option value="Retirada de Chave">Retirada de Chave</option>
                <option value="Devolução de Chave">Devolução de Chave</option>
                <option value="Acesso Bloqueado">Acesso Bloqueado</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Setor/Ambiente</label>
              <select
                className="border border-slate-205 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-blue-600 bg-slate-50/20 text-slate-700"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                <option value="Todos os Setores">Todos os Setores</option>
                <option value="Laboratórios de Informática">Laboratórios de Informática</option>
                <option value="Salas de Aula - Bloco A">Salas de Aula - Bloco A</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:opacity-95 transition-all active:scale-95 shadow-none cursor-pointer uppercase tracking-wider"
              >
                <Filter size={14} />
                <span>Filtrar</span>
              </button>
              <button
                onClick={handleExport}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg hover:opacity-90 transition-all border border-slate-200 cursor-pointer"
                title="Exportar Relatório"
              >
                <Download size={16} />
              </button>
            </div>
          </section>

          {/* Interactive Search Tool segment */}
          <div className="relative group">
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-blue-600"
              placeholder="Pesquisar logs por responsável, departamento, ou ambiente..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
          </div>

          {/* Bento Audit section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left section: Audit logs list table */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                  <FileText size={16} />
                  <span>Histórico de Atividades</span>
                </h2>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-750 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Total: {filteredLogs.length} Registros
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Responsável</th>
                      <th className="px-6 py-3">Ação</th>
                      <th className="px-6 py-3">Recurso</th>
                      <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-100">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-slate-400 font-medium">
                          Nenhum registro de auditoria encontrado para esses filtros.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                          <td className="px-6 py-4 text-slate-400">{log.timestamp}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-700">
                                {log.userInitials}
                              </div>
                              <span className="font-bold text-slate-700">{log.userName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-805">{log.action}</div>
                            {log.duration && (
                              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {log.duration}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-semibold">{log.resource}</td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                log.status === 'Crítico'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {log.status === 'Crítico' ? 'Crítico' : 'Sucesso'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right section: live status and warnings list */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <Play size={16} />
                <span>Em Uso Agora</span>
              </h2>

              <div className="space-y-4">
                {activeOccupants.length === 0 ? (
                  <div className="bg-white p-6 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs font-semibold">
                    Nenhuma chave está em circulação no momento.
                  </div>
                ) : (
                  activeOccupants.map((occ, i) => (
                    <div key={occ.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-600 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Key size={14} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{occ.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Retirada: {occ.withdrawalTime || '08:30'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs">
                          {(occ.currentResponsible || 'PF').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-700 leading-none">{occ.currentResponsible || 'Prof. Responsável'}</p>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: i === 0 ? '60%' : '90%' }}></div>
                          </div>
                        </div>
                      </div>

                      {i > 0 && (
                        <p className="mt-2 text-[10px] text-red-600 font-bold flex items-center gap-1">
                          <AlertTriangle size={12} />
                          <span>Tempo limite de aula excedido</span>
                        </p>
                      )}
                    </div>
                  ))
                )}

                {/* Summary widget summary panel */}
                <div className="bg-slate-900 p-6 text-white rounded-xl shadow-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Resumo da Manhã</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <h4 className="text-3xl font-bold">{activeOccupants.length}</h4>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-1">Chaves Ativas</p>
                    </div>
                    <div>
                      <h4 className="text-3xl font-bold">{environments.length}</h4>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-1">Total Ambientes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Sincronização completa realizada!')}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold py-2.5 transition-all text-center cursor-pointer uppercase tracking-wider"
                  >
                    Gerar Relatório Diário
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Análise de Frequência de Uso bar chart stats */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">Análise de Frequência de Uso</h2>
                <p className="text-xs text-slate-500">Distribuição de acesso por bloco e horário (Últimos 30 dias)</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <span className="px-3 py-1.5 bg-white shadow-xs rounded-md text-slate-800 font-bold text-xs select-none cursor-pointer">Blocos</span>
                <span className="px-3 py-1.5 text-slate-400 hover:text-slate-700 font-semibold text-xs select-none cursor-pointer">Tipos</span>
              </div>
            </div>

            {/* Simulated bar chart scale */}
            <div className="h-44 w-full relative flex items-end gap-2.5 pt-6">
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-350 font-bold pointer-events-none">
                <div className="border-b border-slate-100 w-full pb-1">100%</div>
                <div className="border-b border-slate-100 w-full pb-1">75%</div>
                <div className="border-b border-slate-100 w-full pb-1">50%</div>
                <div className="border-b border-slate-100 w-full pb-1">25%</div>
                <div className="w-full h-0"></div>
              </div>

              {/* Ratios bars */}
              {['Bloco A', 'Bloco B', 'Bloco C', 'Bloco D', 'Laboratórios', 'Serviços', 'Administração', 'Média'].map((blockName, index) => {
                const ratios = [82, 45, 95, 60, 30, 70, 50, 68];
                return (
                  <div
                    key={blockName}
                    style={{ height: `${ratios[index]}%` }}
                    className="flex-1 bg-blue-600/10 rounded-t-lg group relative hover:bg-blue-600/30 transition-all cursor-default"
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-25 font-bold">
                      {blockName}: {ratios[index]}%
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">
              <span>Bloco A</span>
              <span>Bloco B</span>
              <span>Bloco C</span>
              <span>Bloco D</span>
              <span>Laboratórios</span>
              <span>Serviços</span>
              <span>Admin</span>
              <span>Geral</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
