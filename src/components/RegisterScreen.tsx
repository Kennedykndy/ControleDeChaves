/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, TransitionType, UserAccount } from '../types';
import { ShieldCheck, User, Mail, BadgeAlert, Lock, Shield, Eye, EyeOff, ArrowRight, Image as ImageIcon } from 'lucide-react';

interface RegisterScreenProps {
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  onRegisterSuccess: (newAccount: UserAccount) => void;
}

export default function RegisterScreen({ onNavigate, onRegisterSuccess }: RegisterScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [registration, setRegistration] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
      setErrorMsg('Por favor, informe seu Nome Completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor, informe um E-mail Institucional válido.');
      return;
    }
    if (!registration.trim()) {
      setErrorMsg('Por favor, insira sua Matrícula.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('Você precisa aceitar os Termos de Uso e Política de Privacidade.');
      return;
    }

    const newAcc: UserAccount = {
      fullName,
      email,
      registration,
      password,
      profilePicture: profilePic || undefined,
    };

    onRegisterSuccess(newAcc);
    setSuccessMsg('Conta criada com sucesso! Redirecionando para tela de login...');

    setTimeout(() => {
      onNavigate('login', 'push_back');
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background radial effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Left Visual side */}
        <div className="hidden lg:flex lg:col-span-12 xl:col-span-5 flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 z-0">
            <img
              alt="Campus Senac"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9toLrdVI0vLGIzC3acLbvU43hjcKrPlkjO35Cgo9Zwc4a5cjAKEeYrtfJeogDh3BmzLxaMXqmDSpSLTMNemew5KZtaJpA4Vtbr6jW0ITgvOFA4AlGRw_oBMkPQ21HaMzImY1weMjJtw3IqNL5RENzyHdoXmHg2U8SOyTM3DqeYcuPmZ9JPEi_jQACnuEaVcoMB0mDQSNllmWCxbigX5T3RN87Lf6JcsyE7vw6OcpcTgsawc_vpAgftb64CPiADBdVb-zDdwceDO0"
            />
          </div>

          <div className="relative z-10">
            <div className="mb-10">
              <h1 className="text-2xl font-bold tracking-tight uppercase">SENAC</h1>
              <p className="text-[10px] font-bold opacity-80 tracking-widest uppercase mt-1">Agreste</p>
            </div>
            <div className="mt-10">
              <h2 className="text-3xl font-extrabold mb-4 leading-snug tracking-tight">
                Excelência em <br />
                <span className="text-blue-500">Gestão Educacional</span>
              </h2>
              <p className="text-xs text-slate-300 opacity-95 leading-relaxed max-w-sm">
                Faça parte da rede de ensino que transforma o futuro de Agreste. Acesse ferramentas novas para controle.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-semibold">Acesso Seguro</p>
              <p className="text-[10px] opacity-75">Certificação Institucional Ativa</p>
            </div>
          </div>
        </div>

        {/* Right Form side */}
        <div className="p-8 md:p-12 lg:col-span-12 xl:col-span-7 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Criar Nova Conta</h2>
            <p className="text-xs text-slate-500 mt-2">Preencha os dados abaixo para solicitar seu acesso ao sistema.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-xs text-emerald-800 font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center gap-3 pb-3 border-b border-slate-100 mb-2">
              <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block text-center">
                Sua Foto de Perfil (Opcional)
              </label>
              <label className="relative group cursor-pointer flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {profilePic ? (
                  <div className="relative w-20 h-20 rounded-full border border-slate-205 overflow-hidden shadow-sm flex items-center justify-center bg-slate-50 transition-all hover:border-blue-600">
                    <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[8px] font-bold uppercase transition-opacity">
                      <ImageIcon size={12} className="mb-0.5" />
                      <span>Alterar</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 overflow-hidden transition-all group-hover:border-blue-600 group-hover:bg-slate-100/50">
                    <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mb-1" />
                    <span className="text-[8px] text-slate-400 group-hover:text-blue-600 font-bold uppercase tracking-wider">Enviar Foto</span>
                  </div>
                )}
              </label>
              {profilePic && (
                <button
                  type="button"
                  onClick={() => setProfilePic('')}
                  className="text-[9px] text-red-500 font-bold hover:underline uppercase tracking-wider"
                >
                  Remover Foto
                </button>
              )}
            </div>

            {/* Nome Completo */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block" htmlFor="full_name">
                Nome Completo
              </label>
              <div className="relative flex items-center">
                <User size={14} className="absolute left-3.5 text-slate-400 font-medium" />
                <input
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                  id="full_name"
                  name="full_name"
                  placeholder="Ex: João da Silva Santos"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* E-mail Institucional */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block" htmlFor="email">
                  E-mail Institucional
                </label>
                <div className="relative flex items-center">
                  <Mail size={14} className="absolute left-3.5 text-slate-400 font-medium" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                    id="email"
                    name="email"
                    placeholder="usuario@senac.com.br"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Matrícula */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block" htmlFor="registration">
                  Matrícula
                </label>
                <div className="relative flex items-center">
                  <BadgeAlert size={14} className="absolute left-3.5 text-slate-400 font-medium" />
                  <input
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                    id="registration"
                    name="registration"
                    placeholder="0000.00.000"
                    type="text"
                    value={registration}
                    onChange={(e) => setRegistration(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block" htmlFor="password">
                Senha
              </label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3.5 text-slate-400 font-medium" />
                <input
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-3.5 text-slate-400 hover:text-blue-600 transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirmação de Senha */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block" htmlFor="confirm_password">
                Confirmação de Senha
              </label>
              <div className="relative flex items-center">
                <Shield size={14} className="absolute left-3.5 text-slate-400 font-medium" />
                <input
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="••••••••"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="absolute right-3.5 text-slate-400 hover:text-blue-600 transition-colors"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-600 border-slate-350 rounded cursor-pointer"
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <label className="text-xs text-slate-500 leading-normal select-none cursor-pointer" htmlFor="terms">
                Li e aceito os{' '}
                <a className="text-blue-600 font-bold hover:underline" href="#" onClick={(e) => e.preventDefault()}>
                  Termos de Uso
                </a>{' '}
                e a{' '}
                <a className="text-blue-600 font-bold hover:underline" href="#" onClick={(e) => e.preventDefault()}>
                  Política de Privacidade
                </a>{' '}
                institucional do SENAC.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              <button
                className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-none uppercase tracking-wider cursor-pointer"
                type="submit"
              >
                CRIAR MINHA CONTA
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="text-xs text-slate-400">Já possui uma conta?</span>
                <a
                  className="text-blue-600 font-bold text-xs hover:underline decoration-2 cursor-pointer uppercase tracking-wider"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('login', 'push_back');
                  }}
                >
                  ENTRAR NO SISTEMA
                </a>
              </div>
            </div>
          </form>

          {/* Footer institutional info */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2 opacity-60 text-[10px] text-slate-500">
            <p>© 2026 SENAC Agreste</p>
            <div className="flex gap-3">
              <span>Ajuda</span>
              <span>Website</span>
              <span>Contato</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
