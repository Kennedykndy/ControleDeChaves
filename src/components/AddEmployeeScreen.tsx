/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, TransitionType, Employee, AccessLevel, UserAccount } from '../types';
import Sidebar from './Sidebar';
import Header from './Header';
import { UserPlus, Image as ImageIcon, Save, ShieldAlert, BadgeCheck } from 'lucide-react';

interface AddEmployeeScreenProps {
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  currentUser?: UserAccount;
  onLogout: () => void;
}

export default function AddEmployeeScreen({
  onNavigate,
  employees,
  setEmployees,
  currentUser,
  onLogout,
}: AddEmployeeScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [registration, setRegistration] = useState('');
  const [sector, setSector] = useState('');
  const [role, setRole] = useState('');
  const [notes, setNotes] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('staff');
  const [profilePic, setProfilePic] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Por favor, informe o Nome Completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor, informe um E-mail Corporativo válido.');
      return;
    }
    if (!registration.trim()) {
      setErrorMsg('Por favor, informe a Matrícula.');
      return;
    }
    if (!sector) {
      setErrorMsg('Por favor, selecione o setor.');
      return;
    }
    if (!role.trim()) {
      setErrorMsg('Por favor, informe o Cargo.');
      return;
    }

    setLoading(true);

    const newEmp: Employee = {
      id: `EMP-${Date.now()}`,
      fullName,
      email,
      registration,
      sector,
      role,
      notes,
      accessLevel,
      createdAt: new Date().toISOString().split('T')[0],
      profilePicture: profilePic || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0Mo9hweztQvkQdaRJ8ABjVbJlcdDnasggDeYxhR7ds0oYM2XmM9uyJrUBoaYyjHsXfLbeME1uYY8-AcbiIC0UUlT6Z-PVvnI4gTLKuFfuUbeV5lsGP5P7mv-H1bYAFcSUkvNS7oEnj8eIfaj86XDi0I4v2oST8lf8lormT6im3o5xsfibmUURLpqCSGQdRIvWjwY9cW2J4OW7p21HDvLVMPNtuTOc1MGopjlI3CqKPa75v2yGa0rApIajNUTswg1BDJcV7qjAFqg'
    };

    setTimeout(() => {
      setEmployees((prev) => [newEmp, ...prev]);
      setSuccessMsg('Funcionário cadastrado com sucesso!');
      setLoading(false);

      // Reset fields
      setFullName('');
      setEmail('');
      setRegistration('');
      setSector('');
      setRole('');
      setNotes('');
      setAccessLevel('staff');
      setProfilePic('');

      // Return to dashboard after success
      setTimeout(() => {
        onNavigate('dashboard', 'push_back');
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Drawer */}
      <Sidebar currentScreen="add-employee" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout} />

      {/* Main Container */}
      <div className="pl-[260px] min-h-screen flex flex-col">
        {/* Header bar */}
        <Header title="Gestão de Equipe" userFullName={currentUser?.fullName} profilePicture={currentUser?.profilePicture} />

        <main className="p-8 max-w-4xl mx-auto w-full space-y-6 flex-1">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Equipe</span>
            <span>/</span>
            <span className="text-blue-600">Novo Cadastro</span>
          </div>

          <header className="mb-4">
            <h1 className="text-xl font-bold text-slate-900 leading-none tracking-tight">Cadastrar Novo Funcionário</h1>
            <p className="text-xs text-slate-500 mt-2">Insira os dados cadastrais e defina os privilégios de acesso institucional.</p>
          </header>

          {errorMsg && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-xs text-emerald-800 flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Col: Upload Pic and Access Level */}
            <div className="md:col-span-4 space-y-6">
              {/* Picture Upload Box */}
              <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">Foto de Perfil</h3>
                <div className="flex flex-col items-center gap-4">
                  <label className="relative group cursor-pointer w-full flex justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {profilePic ? (
                      <div className="relative w-24 h-24 rounded-full border border-slate-205 overflow-hidden shadow-sm flex items-center justify-center bg-slate-50 transition-all hover:border-blue-600">
                        <img src={profilePic} alt="Preview" className="w-full h-full object-cover animate-fade-in" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-bold uppercase transition-opacity">
                          <ImageIcon size={14} className="mb-0.5" />
                          <span>Alterar</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 overflow-hidden transition-all group-hover:border-blue-600 group-hover:bg-slate-100/50">
                        <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-600 mb-1" />
                        <span className="text-[9px] text-slate-400 group-hover:text-blue-600 font-bold uppercase tracking-wider">Enviar Foto</span>
                      </div>
                    )}
                  </label>
                  {profilePic && (
                    <button
                      type="button"
                      onClick={() => setProfilePic('')}
                      className="text-[10px] text-red-500 font-bold hover:underline uppercase tracking-wider"
                    >
                      Remover Foto
                    </button>
                  )}
                  <p className="text-[9px] text-center text-slate-400">Formatos suportados: JPG, PNG. Máx 2MB.</p>
                </div>
              </div>

              {/* Access Levels radio box */}
              <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider">Nível de Acesso</h3>
                <div className="space-y-3">
                  <label
                    onClick={() => setAccessLevel('admin')}
                    className={`flex items-center p-3 border rounded-xl hover:bg-slate-50 transition-colors cursor-pointer ${
                      accessLevel === 'admin' ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200'
                    }`}
                  >
                    <input
                      className="w-4 h-4 text-blue-600 border-slate-350 focus:ring-blue-600"
                      type="radio"
                      name="access"
                      checked={accessLevel === 'admin'}
                      onChange={() => setAccessLevel('admin')}
                    />
                    <div className="ml-3">
                      <p className="text-xs font-bold text-slate-800 leading-tight">Administrador</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">Acesso total ao sistema</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setAccessLevel('staff')}
                    className={`flex items-center p-3 border rounded-xl hover:bg-slate-50 transition-colors cursor-pointer ${
                      accessLevel === 'staff' ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200'
                    }`}
                  >
                    <input
                      className="w-4 h-4 text-blue-600 border-slate-350 focus:ring-blue-600"
                      type="radio"
                      name="access"
                      checked={accessLevel === 'staff'}
                      onChange={() => setAccessLevel('staff')}
                    />
                    <div className="ml-3">
                      <p className="text-xs font-bold text-slate-800 leading-tight">Funcionário Padrão</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">Acesso a rotinas básicas</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setAccessLevel('viewer')}
                    className={`flex items-center p-3 border rounded-xl hover:bg-slate-50 transition-colors cursor-pointer ${
                      accessLevel === 'viewer' ? 'border-blue-600 bg-blue-50/10' : 'border-slate-200'
                    }`}
                  >
                    <input
                      className="w-4 h-4 text-blue-600 border-slate-350 focus:ring-blue-600"
                      type="radio"
                      name="access"
                      checked={accessLevel === 'viewer'}
                      onChange={() => setAccessLevel('viewer')}
                    />
                    <div className="ml-3">
                      <p className="text-xs font-bold text-slate-800 leading-tight">Visualizador</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">Apenas leitura e relatórios</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Col: Fields */}
            <div className="md:col-span-8 bg-white p-6 border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-6 uppercase tracking-wider">Informações Gerais</h3>
                <div className="space-y-4">
                  {/* Nome Completo */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nome Completo</label>
                    <input
                      className="w-full px-4 py-2 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                      placeholder="Ex: Maria Oliveira Santos"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  {/* Email e Matricula */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">E-mail Corporativo</label>
                      <input
                        className="w-full px-4 py-2 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/55"
                        placeholder="maria.santos@senac.br"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Matrícula</label>
                      <input
                        className="w-full px-4 py-2 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/55"
                        placeholder="000.000-0"
                        type="text"
                        value={registration}
                        onChange={(e) => setRegistration(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Setor e Cargo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Setor</label>
                      <select
                        className="w-full px-4 py-2 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/55 text-slate-705"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                      >
                        <option value="">Selecione o setor</option>
                        <option value="adm">Administrativo</option>
                        <option value="acad">Acadêmico</option>
                        <option value="fin">Financeiro</option>
                        <option value="ti">Tecnologia da Informação</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cargo</label>
                      <input
                        className="w-full px-4 py-2 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/55"
                        placeholder="Ex: Analista de Sistemas"
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Observações */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Observações (Opcional)</label>
                    <textarea
                      className="w-full px-4 py-2 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/55"
                      placeholder="Alguma observação relevante sobre o funcionário..."
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard', 'push_back')}
                  className="px-5 py-2.5 border border-slate-200 rounded-lg text-xs text-slate-650 font-bold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-2 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-none cursor-pointer uppercase tracking-wider"
                >
                  <Save size={14} />
                  <span>{loading ? 'Adicionando...' : 'Confirmar Cadastro'}</span>
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
