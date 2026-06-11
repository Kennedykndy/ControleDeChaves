/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, TransitionType, Environment, EnvironmentStatus, UserAccount } from '../types';
import Sidebar from './Sidebar';
import Header from './Header';
import { Key, Building, Check, Save, ShieldAlert, BadgePlus } from 'lucide-react';

interface AddKeyScreenProps {
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  environments: Environment[];
  setEnvironments: React.Dispatch<React.SetStateAction<Environment[]>>;
  currentUser?: UserAccount;
  onLogout: () => void;
}

export default function AddKeyScreen({
  onNavigate,
  environments,
  setEnvironments,
  currentUser,
  onLogout,
}: AddKeyScreenProps) {
  const [keyId, setKeyId] = useState('');
  const [status, setStatus] = useState<EnvironmentStatus>('Disponível');
  const [name, setName] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('Térreo');
  const [capacity, setCapacity] = useState('40');
  const [resources, setResources] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const toggleResource = (res: string) => {
    setResources((prev) =>
      prev.includes(res) ? prev.filter((r) => r !== res) : [...prev, res]
    );
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!keyId.trim()) {
      setErrorMsg('Por favor, informe o Identificador Único da Chave (ID).');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Por favor, informe o Nome do Ambiente.');
      return;
    }
    if (!block.trim()) {
      setErrorMsg('Por favor, informe o Bloco / Setor.');
      return;
    }
    const capNum = parseInt(capacity, 10);
    if (isNaN(capNum) || capNum <= 0) {
      setErrorMsg('A capacidade deve ser um número válido maior que zero.');
      return;
    }

    const newEnv: Environment = {
      id: keyId,
      keyId,
      name,
      block,
      floor,
      capacity: capNum,
      resources,
      status,
    };

    setEnvironments((prev) => [newEnv, ...prev]);
    setSuccessMsg('Ambiente e Chave cadastrados com sucesso!');

    setKeyId('');
    setName('');
    setBlock('');
    setFloor('Térreo');
    setCapacity('40');
    setResources([]);

    setTimeout(() => {
      onNavigate('dashboard', 'push_back');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentScreen="add-key" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} />

      {/* Main Container */}
      <div className="pl-[260px] min-h-screen flex flex-col">
        {/* Header bar */}
        <Header title="Gestão de Ambientes" userFullName={currentUser?.fullName} profilePicture={currentUser?.profilePicture} />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
          {/* Page Header */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Cadastrar Chaves e Ambientes</h2>
              <p className="text-xs text-slate-500 mt-2">Configure novos recursos físicos para a unidade institucional.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('dashboard', 'push_back')}
                className="px-5 py-2.5 border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold text-xs rounded-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSave()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg hover:opacity-95 active:scale-95 transition-all shadow-none cursor-pointer uppercase tracking-wider"
              >
                Salvar Registro
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-xs text-emerald-800 flex items-center gap-2">
              <BadgePlus className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Bento Grid layout */}
          <form onSubmit={handleSave} className="grid grid-cols-12 gap-6">
            {/* Sec: Key data */}
            <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2 text-slate-800">
                <Key size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Dados da Chave</h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Identificador Único (ID)</label>
                <input
                  className="w-full border border-slate-205 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                  placeholder="Ex: CHV-402-A"
                  type="text"
                  value={keyId}
                  onChange={(e) => setKeyId(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status Inicial</label>
                <select
                  className="w-full border border-slate-205 rounded-lg px-3 py-2 text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:border-blue-600"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EnvironmentStatus)}
                >
                  <option value="Disponível">Disponível</option>
                  <option value="Manutenção">Em Manutenção</option>
                  <option value="Limpeza">Reservada / Limpeza</option>
                </select>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 mt-4 text-[10px] text-slate-400 italic">
                As chaves cadastradas serão automaticamente vinculadas ao sistema de controle de acesso por QR Code.
              </div>
            </div>

            {/* Sec: Environment specs */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2 text-slate-800">
                <Building size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Especificações do Ambiente</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nome do Ambiente</label>
                  <input
                    className="w-full border border-slate-205 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                    placeholder="Ex: Laboratório de Informática 04"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="col-span-2 md:col-span-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Bloco / Setor</label>
                  <input
                    className="w-full border border-slate-205 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                    placeholder="Ex: Bloco Tecnológico"
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                  />
                </div>

                <div className="col-span-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Andar</label>
                  <select
                    className="w-full border border-slate-205 rounded-lg px-3 py-2 text-xs bg-slate-50/50 text-slate-800 focus:outline-none focus:border-blue-600"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                  >
                    <option value="Térreo">Térreo</option>
                    <option value="1º Andar">1º Andar</option>
                    <option value="2º Andar">2º Andar</option>
                    <option value="3º Andar">3º Andar</option>
                  </select>
                </div>

                <div className="col-span-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Capacidade (Pessoas)</label>
                  <input
                    className="w-full border border-slate-205 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 text-slate-800"
                    placeholder="40"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>

                {/* Checklist variables */}
                <div className="col-span-2 space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recursos Disponíveis</label>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-slate-705">
                    {['Ar Condicionado', 'Projetor', 'Quadro Branco', 'Computadores'].map((res) => (
                      <label key={res} className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded text-blue-600 focus:ring-blue-600 border-slate-350"
                          checked={resources.includes(res)}
                          onChange={() => toggleResource(res)}
                        />
                        <span>{res}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Context Box segment */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="relative group h-36 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Laboratory inside SENAC"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsCW7mSfWdAtsyqRyjDN-5vl6kPPJ_yuT00BkP-6tYaECPnEbeVsUMND9CTyuUW-SSzCMl3I3OiGa2p1JA366wgkorCCiXUw8rUgOrZ23NY5hl7DgIBkTLSGpSwUYYF4PQGecjn2IGwK0OSgSaIR46LjRkKYuEPqjv0DDfo9Bx9zvC6IdxPJeSOU8yLc1Y2AvrVHQ5xelzrqOky5yPhbz-8yj7WwnQ3CZtE3bWBq84BzrrQAszMDLiiatRUY4WYM1j3Yq6Oihugww"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">Vista do Bloco A</span>
                </div>
              </div>

              <div className="relative group h-36 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Physical Keyring storage"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTsC6q7X72DRqwMVfh9LZhsdNfvt_Nxk0jB4Pl5K2PxlO_60ZxzC0cMvV7KZRQISwzRvM13AGxuxoHjuLhq8XWmMRQ0TneqvHr2cw1I7lF3aDfG3ArboyBiEswQ25DYhhiu_RBNZT2PoRa6R2GuKwaBvJVUSNnmVWNtY-WXXs2Bz_NKru5wYQ4SOqXmwotnS-yF7OfYU80Vgz1Sh1nLsnOzPGDyg8mxKdfzRuMUiRn-zBZA_gY7gCjkuWPaQCeVpd_Gsbi_3sBN-g"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">Gestão de Cobertura</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-center h-36 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 mb-1 leading-tight uppercase tracking-wider">Dica de Cadastro</h4>
                <p className="text-[11px] text-slate-500 font-medium">Garanta que o ID da chave corresponda exatamente à etiqueta física para evitar discrepâncias nos relatórios de auditoria.</p>
              </div>
            </div>
          </form>

          {/* Last registered listed in lightweight table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-4">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Registros Existentes</h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 rounded-full px-2.5 py-0.5 font-bold">{environments.length} Ambientes</span>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <tbody>
                  {environments.slice(0, 3).map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                      <td className="px-6 py-4 text-slate-500">{item.keyId}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{item.block}</td>
                      <td className="px-6 py-4 text-slate-500 font-semibold">{item.capacity} pessoas</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'Disponível' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
