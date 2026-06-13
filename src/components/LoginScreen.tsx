/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ScreenType, TransitionType, UserAccount } from "../types";
import { Lock, Eye, EyeOff, LogIn, ShieldAlert } from "lucide-react";
import logo from "../assets/logo.png";

interface LoginScreenProps {
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  onLoginSuccess: (user: UserAccount) => void;
  accounts: UserAccount[];
}

export default function LoginScreen({
  onNavigate,
  onLoginSuccess,
  accounts,
}: LoginScreenProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedIdentifier = identifier.trim();
    const normalizedPassword = password.trim();

    if (!normalizedIdentifier) {
      setErrorMsg("Por favor, informe seu E-mail ou Matrícula.");
      return;
    }
    if (!normalizedPassword) {
      setErrorMsg("Por favor, digite sua senha.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    const normalizeRegistration = (str: string) =>
      str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    window.setTimeout(() => {
      const matched = accounts.find((acc) => {
        // match by email
        if (acc.email && acc.email.toLowerCase() === normalizedIdentifier.toLowerCase()) return true;

        // otherwise try matching by normalized registration
        if (acc.registration) {
          const accReg = normalizeRegistration(acc.registration);
          const inputReg = normalizeRegistration(normalizedIdentifier);
          if (accReg === inputReg) return true;
        }

        return false;
      });

      if (!matched) {
        setErrorMsg("Nenhuma conta foi encontrada para este acesso.");
        setLoading(false);
        return;
      }

      const passwordMatches = matched.password === undefined || matched.password === normalizedPassword;

      if (!passwordMatches) {
        setErrorMsg("E-mail ou senha inválidos.");
        setLoading(false);
        return;
      }

      onLoginSuccess(matched);
      onNavigate("dashboard", "push");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Dots styling directly using Tailwind inline gradients */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <main className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-white rounded-2xl shadow-xl min-h-[640px] z-10 border border-slate-100">
        {/* Left Visual Side */}
        <section className="hidden md:flex md:col-span-7 relative flex-col justify-between p-12 overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 z-0">
            <img
              alt="Campus SENAC Agreste"
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
              referrerPolicy="no-referrer"
              src={logo}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-905 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white rounded-lg p-1.5 flex items-center justify-center shadow-md overflow-hidden">
                <img
                  src={logo}
                  alt="SENAC Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                SENAC{" "}
                <span className="font-light opacity-80 text-lg">Agreste</span>
              </h1>
            </div>
            <h2 className="text-3xl font-bold mb-4 max-w-md leading-tight tracking-tight">
              Excelência na gestão acadêmica e profissional.
            </h2>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed mt-2">
              Acesse o portal administrativo para gerenciar recursos, chaves e
              acompanhar o progresso institucional.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-slate-400">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                Agreste
              </span>
              <span className="text-xs text-slate-300">
                Centro de Educação Profissional
              </span>
            </div>
          </div>
        </section>

        {/* Right Form Side */}
        <section className="col-span-1 md:col-span-5 flex flex-col justify-center p-6 md:p-12 bg-white">
          <div className="w-full max-w-[400px] mx-auto flex flex-col justify-between h-full py-2">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 bg-white rounded border p-1 flex items-center justify-center overflow-hidden">
                <img
                  src={logo}
                  alt="SENAC Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">
                SENAC Agreste
              </h1>
            </div>

            <div>
              <div className="mb-6 flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <img
                  src={logo}
                  alt="Logotipo do SENAC Agreste"
                  className="h-16 w-auto object-contain"
                />
              </div>

              <header className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Portal de Acesso
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Identifique-se para acessar o sistema.
                </p>
              </header>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded text-xs text-red-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input E-mail / Matrícula */}
                <div className="space-y-1.5">
                  <label
                    className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                    htmlFor="identifier"
                  >
                    E-mail ou Matrícula
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <span className="text-sm">@</span>
                    </div>
                    <input
                      className="w-full h-11 pl-10 pr-4 bg-slate-50/50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-xs text-slate-850 placeholder:text-slate-400"
                      id="identifier"
                      name="identifier"
                      placeholder="Digite seu acesso"
                      required
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                {/* Input Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label
                      className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"
                      htmlFor="password"
                    >
                      Senha
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Para alterar sua senha, entre em contato com a equipe de TI do SENAC.",
                        )
                      }
                      className="text-[10px] font-bold text-blue-600 hover:underline hover:text-blue-700 uppercase tracking-wider"
                    >
                      Esqueceu?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Lock size={14} />
                    </div>
                    <input
                      className="w-full h-11 pl-10 pr-10 bg-slate-50/50 border border-slate-205 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all text-xs text-slate-850 placeholder:text-slate-400"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs rounded-lg shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider"
                  >
                    <span>{loading ? "Entrando..." : "ENTRAR NO SISTEMA"}</span>
                    {!loading && <LogIn size={14} />}
                  </button>
                </div>
              </form>
            </div>

            <footer className="mt-8 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500 mb-3">
                Não possui uma credencial?
              </p>
              <button
                onClick={() => onNavigate("register", "push")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 border border-slate-200 px-5 py-2.5 rounded-lg hover:bg-slate-50 active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
              >
                CRIAR CONTA
              </button>
            </footer>

            {/* Meta Footer */}
            <div className="mt-6 pt-2 flex flex-wrap justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                Secured Connection
              </span>
              <span>v1.0.4</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
