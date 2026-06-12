/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ScreenType,
  TransitionType,
  Environment,
  ActivityLog,
  UserAccount,
  Employee,
} from "../types";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {
  Key,
  CheckCircle,
  PersonStanding,
  Wrench,
  Search,
  Plus,
  ArrowUpRight,
  User,
  Clock,
  X,
  FileText,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Award,
} from "lucide-react";

interface DashboardScreenProps {
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  environments: Environment[];
  setEnvironments: React.Dispatch<React.SetStateAction<Environment[]>>;
  logs: ActivityLog[];
  setLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  currentUser?: UserAccount;
  onLogout: () => void;
  employees: Employee[];
}

export default function DashboardScreen({
  onNavigate,
  environments,
  setEnvironments,
  logs,
  setLogs,
  currentUser,
  onLogout,
  employees,
}: DashboardScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Key operations modal states
  const [selectedEnvForAction, setSelectedEnvForAction] =
    useState<Environment | null>(null);
  const [actionType, setActionType] = useState<"checkout" | "checkin" | null>(
    null,
  );

  // Checkout states
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [customResponsible, setCustomResponsible] = useState("");
  const [checkoutNotes, setCheckoutNotes] = useState("Uso regular para aula");
  const [estimatedDuration, setEstimatedDuration] = useState("2h");
  const [checkoutTime, setCheckoutTime] = useState("08:00");
  const [confirmRegistration, setConfirmRegistration] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  // Checkin states
  const [returnStatus, setReturnStatus] = useState<
    "Disponível" | "Limpeza" | "Manutenção"
  >("Disponível");
  const [returnObservation, setReturnObservation] = useState("");
  const [checkinTime, setCheckinTime] = useState("10:00");

  // Calculate dynamic metrics from state
  const totalKeys = environments.length;
  const availableKeys = environments.filter(
    (e) => e.status === "Disponível",
  ).length;
  const occupiedKeys = environments.filter(
    (e) => e.status === "Ocupado",
  ).length;
  const maintenanceKeys = environments.filter(
    (e) => e.status === "Manutenção",
  ).length;

  // Filter rooms
  const filteredEnvironments = environments.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.block.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter employees for checkout modal
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.registration.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.role.toLowerCase().includes(employeeSearch.toLowerCase()),
  );

  // Open checkout or checkin wizard
  const handleOpenAction = (env: Environment) => {
    setSelectedEnvForAction(env);
    const nowStr = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (env.status === "Disponível") {
      setActionType("checkout");
      // Set default employee
      if (employees && employees.length > 0) {
        setSelectedEmployeeId(employees[0].id);
      } else {
        setSelectedEmployeeId("");
      }
      setEmployeeSearch("");
      setCustomResponsible("");
      setCheckoutNotes("Uso regular para aula");
      setEstimatedDuration("2h");
      setCheckoutTime(nowStr);
      setConfirmRegistration("");
      setRegistrationError("");
    } else {
      setActionType("checkin");
      setReturnStatus("Disponível");
      setReturnObservation("");
      setCheckinTime(nowStr);
    }
  };

  // Perform backend Checkout update
  const handleConfirmCheckout = () => {
    if (!selectedEnvForAction) return;

    // 1. Check if a confirmation registration was provided
    if (!confirmRegistration.trim()) {
      setRegistrationError(
        "Por favor, informe o número de matrícula para confirmar a retirada.",
      );
      return;
    }

    const normalizeRegistration = (str: string) =>
      str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const enteredNormalized = normalizeRegistration(confirmRegistration);

    let finalResponsible = "";
    let initials = "FG";

    // Prioritize selected employee from list, otherwise fallback to typed custom name
    if (customResponsible.trim()) {
      finalResponsible = customResponsible.trim();
      initials = finalResponsible.slice(0, 2).toUpperCase();

      // For custom manually typed names, still require a realistic registration (minimum 3 characters)
      if (enteredNormalized.length < 3) {
        setRegistrationError(
          "Para nomes personalizados, digite uma matrícula de confirmação válida (mínimo 3 dígitos).",
        );
        return;
      }
    } else {
      const selectedEmp = employees.find(
        (emp) => emp.id === selectedEmployeeId,
      );
      if (selectedEmp) {
        finalResponsible = selectedEmp.fullName;
        initials = selectedEmp.fullName.slice(0, 2).toUpperCase();

        // Match the entered registration with the selected employee database registration
        const dbNormalized = normalizeRegistration(selectedEmp.registration);
        if (enteredNormalized !== dbNormalized) {
          setRegistrationError(
            `Matrícula incorreta para ${selectedEmp.fullName}. A matrícula correspondente deve bater com o registro.`,
          );
          return;
        }
      } else if (currentUser) {
        finalResponsible = currentUser.fullName;
        initials = currentUser.fullName.slice(0, 2).toUpperCase();

        if (currentUser.registration) {
          const userNormalized = normalizeRegistration(
            currentUser.registration,
          );
          if (enteredNormalized !== userNormalized) {
            setRegistrationError(
              `Matrícula incorreta para seu usuário (${currentUser.fullName}).`,
            );
            return;
          }
        }
      } else {
        finalResponsible = "Funcionário Geral";
        initials = "FG";
      }
    }

    setEnvironments((prev) =>
      prev.map((item) => {
        if (item.id === selectedEnvForAction.id) {
          return {
            ...item,
            status: "Ocupado",
            currentResponsible: finalResponsible,
            withdrawalTime: checkoutTime,
          };
        }
        return item;
      }),
    );

    // Register active log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: "Hoje, " + new Date().toLocaleTimeString("pt-BR"),
      userInitials: initials,
      userName: finalResponsible,
      action: "Retirada de Chave",
      resource: selectedEnvForAction.name,
      status: "Sucesso",
      withdrawalTime: checkoutTime,
      duration: `Retirada às ${checkoutTime} (${estimatedDuration} • ${checkoutNotes})`,
    };

    setLogs((prevLogs) => [newLog, ...prevLogs]);

    // Close Modal
    setSelectedEnvForAction(null);
    setActionType(null);
  };

  // Perform backend Checkin update
  const handleConfirmCheckin = () => {
    if (!selectedEnvForAction) return;

    const currentRep = selectedEnvForAction.currentResponsible || "Funcionário";
    const initials = currentRep.slice(0, 2).toUpperCase();

    // Define next responsible depending on selected returning state
    let nextResponsible: string | undefined = undefined;
    if (returnStatus === "Limpeza") {
      nextResponsible = "Equipe Higiene";
    } else if (returnStatus === "Manutenção") {
      nextResponsible = "Equipe Manutenção";
    }

    setEnvironments((prev) =>
      prev.map((item) => {
        if (item.id === selectedEnvForAction.id) {
          return {
            ...item,
            status: returnStatus,
            currentResponsible: nextResponsible,
            withdrawalTime: undefined,
          };
        }
        return item;
      }),
    );

    const origWithdrawal = selectedEnvForAction.withdrawalTime || "08:30";

    // Record log
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: "Hoje, " + new Date().toLocaleTimeString("pt-BR"),
      userInitials: initials,
      userName: currentRep,
      action:
        returnStatus === "Disponível" ? "Devolução" : `Status: ${returnStatus}`,
      resource: selectedEnvForAction.name,
      status: returnStatus === "Manutenção" ? "Info" : "Sucesso",
      withdrawalTime: origWithdrawal,
      returnTime: checkinTime,
      duration: `Retirada: ${origWithdrawal} • Devolução: ${checkinTime}${returnObservation ? ` | Obs: ${returnObservation}` : ""}`,
    };

    setLogs((prevLogs) => [newLog, ...prevLogs]);

    // Close Modal
    setSelectedEnvForAction(null);
    setActionType(null);
  };

  // ✅ NOVA FUNÇÃO (DELETE)
  const handleDeleteEnvironment = (envId: string) => {
    const envToDelete = environments.find((e) => e.id === envId);
    if (!envToDelete) return;

    // ✅ CONFIRMAÇÃO
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir o ambiente "${envToDelete.name}"?`,
    );

    if (!confirmDelete) return;

    setEnvironments((prev) => prev.filter((e) => e.id !== envId));

    const userName = currentUser?.fullName || "Administrador";

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: "Hoje, " + new Date().toLocaleTimeString("pt-BR"),
      userInitials: userName.slice(0, 2).toUpperCase(),
      userName: userName,
      action: "Exclusão de Ambiente",
      resource: envToDelete.name,
      status: "Info",
      duration: `Ambiente ${envToDelete.name} removido`,
    };

    setLogs((prevLogs) => [newLog, ...prevLogs]);

    if (selectedEnvForAction?.id === envId) {
      setSelectedEnvForAction(null);
      setActionType(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      {/* Sidebar Drawer */}
      <Sidebar
        currentScreen="dashboard"
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="pl-[260px] min-h-screen flex flex-col">
        {/* Header */}
        <Header
          title="Gestão de Acesso"
          userFullName={currentUser?.fullName}
          profilePicture={currentUser?.profilePicture}
        />

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8 flex-1">
          {/* Quick Informational Notice about project optimization */}
          <div className="bg-gradient-to-r from-blue-605 from-blue-600 to-indigo-700 text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="bg-white/15 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Sistema Otimizado v1.0.5
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-2 text-white">
                Retiradas e Devoluções de Chaves Simplificadas
              </h2>
              <p className="text-xs text-white/80 max-w-xl">
                Agora o sistema está totalmente interligado com a lista de
                funcionários registrados. Selecione qualquer ambiente abaixo
                para processar retiras, programar devoluções ou sinalizar
                reparos.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate("add-employee", "push")}
                className="bg-white text-blue-700 hover:bg-slate-100 font-bold text-xs px-5 py-2.5 rounded-lg active:scale-95 transition-all cursor-pointer uppercase tracking-wider shadow-sm"
              >
                Novo Funcionário
              </button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Keys */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg">
                  <Key size={18} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-slate-500">
                  Total
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 leading-none">
                {totalKeys}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-2">
                Chaves Cadastradas
              </p>
            </div>

            {/* Disponíveis */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CheckCircle size={18} />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Livre
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 leading-none">
                {availableKeys}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-2">
                Disponíveis no momento
              </p>
            </div>

            {/* Em Uso */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <PersonStanding size={18} />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Ocupado
                </span>
              </div>
              <h3 className="text-3xl font-bold text-blue-600 leading-none">
                {occupiedKeys}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-2">
                Ambientes ocupados
              </p>
            </div>

            {/* Manutenção */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                  <Wrench size={18} />
                </div>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Reparo
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 leading-none">
                {maintenanceKeys}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-2">
                Chaves em manutenção
              </p>
            </div>
          </div>

          {/* Graphical Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly occupancy */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-800 tracking-tight">
                    Ocupação de Salas
                  </h2>
                  <p className="text-xs text-slate-500">
                    Fluxo semanal de utilização dos ambientes
                  </p>
                </div>
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
                  <span className="px-3 py-1 bg-white shadow-xs rounded-md text-xs font-bold text-slate-850 cursor-pointer select-none">
                    Semanal
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer select-none">
                    Diário
                  </span>
                </div>
              </div>

              {/* Weekly bar ratios represented with animated div bars */}
              <div className="relative h-[200px] w-full flex items-end justify-between gap-4 pt-6 px-2">
                <div className="w-full bg-slate-100 h-[60%] rounded-lg relative group transition-all hover:bg-slate-200">
                  <div className="absolute -top-7 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    60% de uso
                  </div>
                </div>
                <div className="w-full bg-blue-600 h-[85%] rounded-lg relative group transition-all hover:bg-blue-700">
                  <div className="absolute -top-7 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    85% de uso
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-[45%] rounded-lg relative group transition-all hover:bg-slate-200">
                  <div className="absolute -top-7 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    45% de uso
                  </div>
                </div>
                <div className="w-full bg-blue-600 h-[95%] rounded-lg relative group transition-all hover:bg-blue-700">
                  <div className="absolute -top-7 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    95% de uso
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-[30%] rounded-lg relative group transition-all hover:bg-slate-200">
                  <div className="absolute -top-7 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    30% de uso
                  </div>
                </div>
                <div className="w-full bg-blue-600 h-[75%] rounded-lg relative group transition-all hover:bg-blue-700">
                  <div className="absolute -top-7 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    75% de uso
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-[55%] rounded-lg relative group transition-all hover:bg-slate-200">
                  <div className="absolute -top-7 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    55% de uso
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-4 px-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
            </div>

            {/* Recent Activities Panel */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-800 tracking-tight">
                  Atividades Recentes
                </h2>
                <p className="text-xs text-slate-400">
                  Últimas movimentações de chaves
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[290px] custom-scrollbar">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex gap-3 text-xs">
                    <div className="w-1.5 self-stretch rounded-full bg-blue-500"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800">
                        {log.action}: {log.resource}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {log.userName} • {log.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={() => onNavigate("reports", "push")}
                  className="w-full py-2.5 text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all border border-dashed border-blue-600/30 text-center cursor-pointer"
                >
                  Ver Histórico de Logs
                </button>
              </div>
            </div>
          </div>

          {/* Status dos Ambientes List Table card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">
                  Status de Chaves por Ambiente
                </h2>
                <p className="text-xs text-slate-500">
                  Selecione qualquer ambiente abaixo para retirar ou repor
                  chaves.
                </p>
              </div>

              {/* Real-time search inside dashboard */}
              <div className="relative group">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:border-blue-600 focus:bg-white w-64 transition-all"
                  placeholder="Filtrar sala ou código..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Ambiente</th>
                    <th className="px-6 py-3">Capacidade</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Responsável Atual</th>
                    <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {filteredEnvironments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-slate-400 text-xs font-medium"
                      >
                        Nenhum ambiente corresponde aos filtros de busca.
                      </td>
                    </tr>
                  ) : (
                    filteredEnvironments.map((env) => (
                      <tr
                        key={env.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">
                            {env.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            Cód: {env.keyId} - {env.block}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">
                          {env.capacity} Lugares
                        </td>
                        <td className="px-6 py-4">
                          <span
                            onClick={() => handleOpenAction(env)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-none ${
                              env.status === "Disponível"
                                ? "bg-emerald-100 text-emerald-700"
                                : env.status === "Ocupado"
                                  ? "bg-blue-100 text-blue-700"
                                  : env.status === "Limpeza"
                                    ? "bg-amber-100 text-amber-705 text-amber-800"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {env.status === "Ocupado" ? "Em Uso" : env.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {env.status === "Ocupado" ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-slate-850 font-bold">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                                <span>{env.currentResponsible}</span>
                              </div>
                              <div className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                                <Clock size={11} />
                                <span>
                                  Retirada: {env.withdrawalTime || "08:30"}
                                </span>
                              </div>
                            </div>
                          ) : env.currentResponsible ? (
                            <div className="flex items-center gap-2 text-slate-450 italic text-xs">
                              <span>({env.currentResponsible})</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">
                              Disponível na portaria
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {env.status === "Disponível" ? (
                            <button
                              onClick={() => handleOpenAction(env)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5 uppercase tracking-wider"
                            >
                              <ArrowUpRight size={11} />
                              Retirar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenAction(env)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5 uppercase tracking-wider"
                            >
                              <CheckCircle size={11} />
                              Devolver
                            </button>
                          )}

                          {/* BOTÃO EXCLUIR */}
                          <button
                            onClick={() => handleDeleteEnvironment(env.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer inline-flex items-center gap-1.5 uppercase tracking-wider"
                          >
                            <X size={11} />
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>
                Exibindo {filteredEnvironments.length} de {environments.length}{" "}
                ambientes
              </span>
            </div>
          </div>
        </div>

        {/* Floating Action Button (FAB) styled to support slide_up navigation to add-key */}
        <button
          onClick={() => onNavigate("add-key", "slide_up")}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-605 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-150 flex items-center justify-center z-40 text-xs cursor-pointer"
        >
          <span className="sr-only">add</span>
          <Plus size={24} />
        </button>
      </div>

      {/* OPERATIONS MODAL OVERLAY (WIZARD checkout / checkin) */}
      {selectedEnvForAction && actionType && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-150 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-start">
              <div>
                <span className="bg-blue-550 bg-blue-600 text-white font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                  {actionType === "checkout"
                    ? "Operação de Saída"
                    : "Operação de Entrada"}
                </span>
                <h3 className="text-lg font-bold mt-2 text-white leading-tight">
                  {selectedEnvForAction.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ID Chave: {selectedEnvForAction.keyId} • Bloco:{" "}
                  {selectedEnvForAction.block} ({selectedEnvForAction.floor})
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedEnvForAction(null);
                  setActionType(null);
                }}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Checkout Form */}
            {actionType === "checkout" ? (
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Searchable Employees list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      1. Selecione o Funcionário Responsável *
                    </label>
                    <button
                      onClick={() => {
                        setSelectedEnvForAction(null);
                        setActionType(null);
                        onNavigate("add-employee", "push");
                      }}
                      className="text-blue-600 hover:underline text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      + Cadastrar Novo
                    </button>
                  </div>

                  <div className="relative mb-2">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-205 rounded-lg text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-800"
                      placeholder="Pesquisar funcionário por nome, matrícula ou cargo..."
                      type="text"
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                    />
                  </div>

                  {/* Employee mini list */}
                  <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                    {filteredEmployees.length === 0 ? (
                      <p className="text-center text-slate-400 py-6 text-xs italic">
                        Nenhum funcionário encontrado com "{employeeSearch}".
                      </p>
                    ) : (
                      filteredEmployees.map((emp) => {
                        const isSelected =
                          selectedEmployeeId === emp.id &&
                          !customResponsible.trim();
                        return (
                          <div
                            key={emp.id}
                            onClick={() => {
                              setSelectedEmployeeId(emp.id);
                              setCustomResponsible("");
                              setConfirmRegistration("");
                              setRegistrationError("");
                            }}
                            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? "border-blue-600 bg-blue-50/20"
                                : "border-slate-150 bg-white hover:bg-slate-50"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs">
                              {emp.profilePicture ? (
                                <img
                                  src={emp.profilePicture}
                                  alt={emp.fullName}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                emp.fullName.slice(0, 2).toUpperCase()
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                {emp.fullName}
                              </p>
                              <p className="text-[10px] text-slate-550 truncate">
                                {emp.role} • Matrícula: {emp.registration}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="block w-2.5 h-2.5 bg-white rounded-full"></span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Optional Custom manual responsible names */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Ou digite o nome de outro profissional responsável:
                  </label>
                  <input
                    className="w-full px-4 py-2.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50"
                    placeholder="Ex: Prof. Kennedy Cabeseta (Caso não esteja no painel)"
                    type="text"
                    value={customResponsible}
                    onChange={(e) => {
                      setCustomResponsible(e.target.value);
                      setConfirmRegistration("");
                      setRegistrationError("");
                    }}
                  />
                  <p className="text-[9px] text-slate-400">
                    O preenchimento deste campo substituirá a seleção da lista
                    acima.
                  </p>
                </div>

                {/* Checkout Duration, Purpose and Withdrawal Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Horário de Retirada *
                    </label>
                    <input
                      className="w-full px-4 py-2.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 text-slate-700 font-medium text-center"
                      type="time"
                      value={checkoutTime}
                      onChange={(e) => setCheckoutTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Tempo Estimado
                    </label>
                    <select
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 text-slate-700 font-medium"
                    >
                      <option value="1h">1 Hora</option>
                      <option value="2h">2 Horas</option>
                      <option value="4h">4 Horas (Meio período)</option>
                      <option value="6h">6 Horas</option>
                      <option value="Turno">Turno Inteiro</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Motivo / Finalidade
                    </label>
                    <input
                      className="w-full px-4 py-2.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 text-slate-850"
                      placeholder="Ex: Aula de Hardware"
                      type="text"
                      value={checkoutNotes}
                      onChange={(e) => setCheckoutNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Registration verification validation box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block">
                      Confirmação por Matrícula *
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-550 leading-normal">
                    Para validar e concluir, digite abaixo o número da matrícula
                    correspondente.
                    {!customResponsible.trim() && (
                      <>
                        {" "}
                        (Dica: a matrícula de{" "}
                        <strong>
                          {employees.find((e) => e.id === selectedEmployeeId)
                            ?.fullName || "Funcionário"}
                        </strong>{" "}
                        é{" "}
                        <strong>
                          {employees.find((e) => e.id === selectedEmployeeId)
                            ?.registration || "pendente"}
                        </strong>
                        ).
                      </>
                    )}
                  </p>
                  <div>
                    <input
                      className={`w-full px-4 py-2.5 text-xs font-mono font-bold rounded-lg border focus:outline-none focus:ring-1 bg-white ${
                        registrationError
                          ? "border-red-500 text-red-800 focus:border-red-600 focus:ring-red-600"
                          : "border-slate-300 focus:border-blue-600 focus:ring-blue-600 text-slate-800"
                      }`}
                      placeholder="Ex: 883.102-4 ou apenas digite os números"
                      type="text"
                      value={confirmRegistration}
                      onChange={(e) => {
                        setConfirmRegistration(e.target.value);
                        if (registrationError) setRegistrationError("");
                      }}
                      required
                    />
                    {registrationError && (
                      <p className="text-[10px] text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{registrationError}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Consent/Policy check */}
                <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl flex gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-800 leading-normal">
                    Este registro de retirada é de caráter oficial. A chave deve
                    ser devolvida à portaria principal pelo próprio funcionário
                    retirante ao término do tempo estipulado.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setSelectedEnvForAction(null);
                      setActionType(null);
                    }}
                    className="px-5 py-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirmCheckout}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-none cursor-pointer uppercase tracking-wider"
                  >
                    Confirmar Retirada
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* Modal Body: Checkin Form */
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Display Current Responsible details */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                    Responsável Atual
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-650 bg-blue-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                      {(selectedEnvForAction.currentResponsible || "FG")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">
                        {selectedEnvForAction.currentResponsible ||
                          "Funcionário Geral"}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Status Ativo: Em uso
                      </p>
                    </div>
                  </div>
                </div>

                {/* Returning destination state */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    1. Estado do ambiente após a entrega
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Disponivel */}
                    <div
                      onClick={() => setReturnStatus("Disponível")}
                      className={`p-3.5 border rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                        returnStatus === "Disponível"
                          ? "border-emerald-500 bg-emerald-50/20"
                          : "border-slate-205 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <CheckCircle
                          className={`w-5 h-5 ${returnStatus === "Disponível" ? "text-emerald-600" : "text-slate-400"}`}
                        />
                        {returnStatus === "Disponível" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        )}
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-bold text-slate-900 leading-tight">
                          Disponível
                        </p>
                        <p className="text-[9px] text-slate-450 mt-1">
                          Livre para novas aulas imediatamente.
                        </p>
                      </div>
                    </div>

                    {/* Limpeza */}
                    <div
                      onClick={() => setReturnStatus("Limpeza")}
                      className={`p-3.5 border rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                        returnStatus === "Limpeza"
                          ? "border-amber-500 bg-amber-50/20"
                          : "border-slate-205 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <RefreshCw
                          className={`w-5 h-5 ${returnStatus === "Limpeza" ? "text-amber-500 font-bold animate-spin-slow" : "text-slate-400"}`}
                        />
                        {returnStatus === "Limpeza" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        )}
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-bold text-slate-900 leading-tight">
                          Para Limpeza
                        </p>
                        <p className="text-[9px] text-slate-450 mt-1">
                          Interliga a Equipe de Higiene para faxina.
                        </p>
                      </div>
                    </div>

                    {/* manutencao */}
                    <div
                      onClick={() => setReturnStatus("Manutenção")}
                      className={`p-3.5 border rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                        returnStatus === "Manutenção"
                          ? "border-red-500 bg-red-50/20"
                          : "border-slate-205 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <Wrench
                          className={`w-5 h-5 ${returnStatus === "Manutenção" ? "text-red-650 text-red-600" : "text-slate-400"}`}
                        />
                        {returnStatus === "Manutenção" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        )}
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-bold text-slate-900 leading-tight">
                          Manutenção
                        </p>
                        <p className="text-[9px] text-slate-450 mt-1">
                          Sinaliza defeitos ou reparos técnicos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Withdrawal & Return times row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Horário de Retirada (Registrado)
                    </label>
                    <div className="w-full px-4 py-2.5 text-xs rounded-lg border border-slate-150 bg-slate-100 text-slate-500 font-bold text-center flex items-center justify-center gap-1.5 select-none">
                      <Clock size={13} />
                      <span>
                        {selectedEnvForAction.withdrawalTime || "08:30"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      Horário de Devolução *
                    </label>
                    <input
                      className="w-full px-4 py-2.5 text-xs rounded-lg border border-blue-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-blue-50/20 text-slate-750 font-bold text-center"
                      type="time"
                      value={checkinTime}
                      onChange={(e) => setCheckinTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Return observation */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Observações de Retorno (Opcional)
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 text-xs rounded-lg border border-slate-205 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50/50 text-slate-800"
                    placeholder="Ex: Projetor funcionando perfeitamente; ar desligado."
                    rows={3}
                    value={returnObservation}
                    onChange={(e) => setReturnObservation(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end font-medium">
                  <button
                    onClick={() => {
                      setSelectedEnvForAction(null);
                      setActionType(null);
                    }}
                    className="px-5 py-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-650 hover:bg-slate-50 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirmCheckin}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-none cursor-pointer uppercase tracking-wider"
                  >
                    Confirmar Devolução
                    <CheckCircle size={14} />
                  </button>
                  <button
                    onClick={() => onNavigate("employees", "push")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Ver Funcionários
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
