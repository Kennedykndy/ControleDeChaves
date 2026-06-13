import React, { useState } from "react";
import {
  Environment,
  ScreenType,
  UserAccount,
  ActivityLog,
  Employee,
} from "../types";
import {
  CheckCircle,
  ArrowUpRight,
  X,
  Clock,
  Search,
  ShieldCheck,
  RefreshCw,
  Wrench,
} from "lucide-react";

interface Props {
  environments: Environment[];
  setEnvironments: React.Dispatch<React.SetStateAction<Environment[]>>;
  logs: ActivityLog[];
  setLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  employees: Employee[];
  currentUser?: UserAccount;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export default function KeyStatusScreen({
  environments,
  setEnvironments,
  logs,
  setLogs,
  employees,
  currentUser,
  onNavigate,
  onLogout,
}: Props) {
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
  const [action, setAction] = useState<"checkout" | "checkin" | null>(null);
  const [statusChoice, setStatusChoice] = useState<
    "Disponível" | "Limpeza" | "Manutenção"
  >("Disponível");

  // Checkout modal states
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    employees && employees.length > 0 ? employees[0].id : "",
  );
  const [customResponsible, setCustomResponsible] = useState("");
  const [confirmRegistration, setConfirmRegistration] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [checkoutNotes, setCheckoutNotes] = useState("Uso regular para aula");
  const [estimatedDuration, setEstimatedDuration] = useState("2h");
  const [checkoutTime, setCheckoutTime] = useState("");

  // Checkin modal states
  const [returnObservation, setReturnObservation] = useState("");
  const [checkinTime, setCheckinTime] = useState("");

  const filteredEmployees = employees.filter((emp) =>
    `${emp.fullName} ${emp.registration} ${emp.role}`.toLowerCase().includes(employeeSearch.toLowerCase()),
  );

  const openAction = (env: Environment) => {
    setSelectedEnv(env);
    const nowStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const mode = env.status === "Disponível" ? "checkout" : "checkin";
    setAction(mode);
    setStatusChoice("Disponível");
    if (mode === "checkin") {
      setCheckinTime(nowStr);
      setReturnObservation("");
    }

    if (mode === "checkout") {
      const nowStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      setEmployeeSearch("");
      setSelectedEmployeeId(employees && employees.length > 0 ? employees[0].id : "");
      setCustomResponsible("");
      setConfirmRegistration("");
      setRegistrationError("");
      setCheckoutNotes("Uso regular para aula");
      setEstimatedDuration("2h");
      setCheckoutTime(nowStr);
    }
  };

  const handleConfirmCheckout = () => {
    if (!selectedEnv) return;

    if (!confirmRegistration.trim()) {
      setRegistrationError("Por favor, informe a matrícula de confirmação.");
      return;
    }

    const normalizeRegistration = (str: string) => str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const enteredNormalized = normalizeRegistration(confirmRegistration);

    let finalResponsible = "";
    let initials = "FG";

    if (customResponsible.trim()) {
      finalResponsible = customResponsible.trim();
      initials = finalResponsible.slice(0, 2).toUpperCase();

      if (enteredNormalized.length < 3) {
        setRegistrationError("Para nomes personalizados, digite uma matrícula válida (mínimo 3 dígitos).");
        return;
      }
    } else {
      const selEmp = employees.find((emp) => emp.id === selectedEmployeeId);
      if (selEmp) {
        finalResponsible = selEmp.fullName;
        initials = selEmp.fullName.slice(0, 2).toUpperCase();
        const dbNormalized = normalizeRegistration(selEmp.registration);
        if (enteredNormalized !== dbNormalized) {
          setRegistrationError(`Matrícula incorreta para ${selEmp.fullName}.`);
          return;
        }
      } else if (currentUser) {
        finalResponsible = currentUser.fullName;
        initials = currentUser.fullName.slice(0, 2).toUpperCase();
        if (currentUser.registration) {
          const userNormalized = normalizeRegistration(currentUser.registration);
          if (enteredNormalized !== userNormalized) {
            setRegistrationError(`Matrícula incorreta para seu usuário (${currentUser.fullName}).`);
            return;
          }
        }
      } else {
        finalResponsible = "Funcionário Geral";
        initials = "FG";
      }
    }

    const nowTime = checkoutTime || new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    setEnvironments((prev) =>
      prev.map((e) =>
        e.id === selectedEnv.id
          ? { ...e, status: "Ocupado", currentResponsible: finalResponsible, withdrawalTime: nowTime }
          : e,
      ),
    );

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: "Hoje, " + new Date().toLocaleTimeString("pt-BR"),
      userInitials: initials,
      userName: finalResponsible,
      action: "Retirada de Chave",
      resource: selectedEnv.name,
      status: "Sucesso",
      withdrawalTime: nowTime,
      duration: `Retirada às ${nowTime} (${estimatedDuration} • ${checkoutNotes})`,
    };

    setLogs((prev) => [newLog, ...prev]);
    setSelectedEnv(null);
    setAction(null);
  };

  const handleConfirmCheckin = () => {
    if (!selectedEnv) return;

    const currentRep = selectedEnv.currentResponsible || "Funcionário";
    const initials = currentRep.slice(0, 2).toUpperCase();

    setEnvironments((prev) =>
      prev.map((e) =>
        e.id === selectedEnv.id
          ? { ...e, status: statusChoice, currentResponsible: statusChoice === "Disponível" ? undefined : e.currentResponsible, withdrawalTime: undefined }
          : e,
      ),
    );

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: "Hoje, " + new Date().toLocaleTimeString("pt-BR"),
      userInitials: initials,
      userName: currentRep,
      action:
        statusChoice === "Disponível"
          ? "Devolução"
          : `Status: ${statusChoice}`,
      resource: selectedEnv.name,
      status: statusChoice === "Manutenção" ? "Info" : "Sucesso",
      withdrawalTime: selectedEnv.withdrawalTime,
      returnTime: checkinTime,
      duration:
        returnObservation &&
        `Obs: ${returnObservation}`,
    };

    setLogs((prev) => [newLog, ...prev]);
    setSelectedEnv(null);
    setAction(null);
  };

  const handleDelete = (envId: string) => {
    const envToDelete = environments.find((e) => e.id === envId);
    if (!envToDelete) return;
    if (!window.confirm(`Confirma exclusão de ${envToDelete.name}?`)) return;

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
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Status de Chaves por Ambiente</h1>

        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("dashboard")} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Voltar
          </button>
          <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg">
            Sair
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {environments.map((env) => (
          <div key={env.id} className="border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">{env.name}</h2>
              <div className="text-sm text-slate-500">Cód: {env.keyId} • {env.block} ({env.floor})</div>
              <div className="mt-2 text-xs">
                <span className={`px-3 py-1 rounded-full ${env.status === "Disponível" ? "bg-emerald-100 text-emerald-700" : env.status === "Ocupado" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                  {env.status === "Ocupado" ? "Em Uso" : env.status}
                </span>
                {env.currentResponsible && (
                  <span className="ml-3 text-xs text-slate-500">Responsável: {env.currentResponsible}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {env.status === "Disponível" ? (
                <button onClick={() => openAction(env)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <ArrowUpRight size={14} /> Retirar
                </button>
              ) : (
                <button onClick={() => openAction(env)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <CheckCircle size={14} /> Devolver
                </button>
              )}

              <button onClick={() => handleDelete(env.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2">
                <X size={14} /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEnv && action && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{action === "checkout" ? "Operação de Retirada" : "Operação de Devolução"}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedEnv.name} — {selectedEnv.keyId}</p>
              </div>
              <button onClick={() => { setSelectedEnv(null); setAction(null); }} className="text-slate-400"><X /></button>
            </div>

            <div className="mt-4">
              {action === "checkout" ? (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">1. Selecione o Funcionário</label>
                    </div>

                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input value={employeeSearch} onChange={(e) => setEmployeeSearch(e.target.value)} placeholder="Pesquisar funcionário" className="w-full pl-9 pr-4 py-2 border rounded text-xs" />
                    </div>

                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                      {filteredEmployees.length === 0 ? (
                        <div className="text-xs text-slate-400 p-4 text-center">Nenhum funcionário encontrado.</div>
                      ) : (
                        filteredEmployees.map((emp) => (
                          <div key={emp.id} onClick={() => { setSelectedEmployeeId(emp.id); setCustomResponsible(""); setConfirmRegistration(""); setRegistrationError(""); }} className={`p-2 rounded cursor-pointer flex items-center gap-3 ${selectedEmployeeId === emp.id && !customResponsible ? "bg-blue-50 border border-blue-200" : "bg-white"}`}>
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">{emp.profilePicture ? <img src={emp.profilePicture} alt={emp.fullName} className="w-full h-full object-cover" /> : emp.fullName.slice(0,2).toUpperCase()}</div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">{emp.fullName}</div>
                              <div className="text-[10px] text-slate-500 truncate">{emp.role} • {emp.registration}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ou digite outro responsável (opcional)</label>
                    <input value={customResponsible} onChange={(e) => { setCustomResponsible(e.target.value); setConfirmRegistration(""); setRegistrationError(""); }} className="w-full mt-2 p-2 border rounded text-xs" placeholder="Ex: Prof. Kennedy" />
                    <p className="text-[9px] text-slate-400">Preencher substitui a seleção da lista.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Horário de Retirada *</label>
                      <input type="time" value={checkoutTime} onChange={(e) => setCheckoutTime(e.target.value)} className="w-full mt-2 p-2 border rounded text-xs text-center" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tempo Estimado</label>
                      <select value={estimatedDuration} onChange={(e) => setEstimatedDuration(e.target.value)} className="w-full mt-2 p-2 border rounded text-xs">
                        <option value="1h">1 Hora</option>
                        <option value="2h">2 Horas</option>
                        <option value="4h">4 Horas</option>
                        <option value="6h">6 Horas</option>
                        <option value="Turno">Turno Inteiro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Motivo</label>
                      <input value={checkoutNotes} onChange={(e) => setCheckoutNotes(e.target.value)} className="w-full mt-2 p-2 border rounded text-xs" placeholder="Ex: Aula prática" />
                    </div>
                  </div>

                  <div className="bg-slate-50 border p-3 rounded">
                    <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-600" /><label className="text-[10px] font-bold">Confirmação por Matrícula *</label></div>
                    <p className="text-[11px] text-slate-500 mt-1">Digite a matrícula correspondente para validar a retirada{!customResponsible && <><br/>Dica: matrícula de <strong>{employees.find(e => e.id === selectedEmployeeId)?.fullName || 'Funcionário'}</strong> é <strong>{employees.find(e => e.id === selectedEmployeeId)?.registration || 'pendente'}</strong></>}</p>
                    <input value={confirmRegistration} onChange={(e) => { setConfirmRegistration(e.target.value); if (registrationError) setRegistrationError(""); }} className={`w-full mt-2 p-2 border rounded text-xs ${registrationError ? 'border-red-500 text-red-800' : ''}`} placeholder="Ex: 883.102-4 ou apenas números" />
                    {registrationError && <div className="text-[10px] text-red-600 mt-2">⚠️ {registrationError}</div>}
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button onClick={() => { setSelectedEnv(null); setAction(null); }} className="px-4 py-2 border rounded">Voltar</button>
                    <button onClick={handleConfirmCheckout} className="px-4 py-2 bg-blue-600 text-white rounded">Confirmar Retirada</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Display Current Responsible details */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                      Responsável Atual
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                        {(selectedEnv.currentResponsible || "FG")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">
                          {selectedEnv.currentResponsible ||
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
                        onClick={() => setStatusChoice("Disponível")}
                        className={`p-3.5 border rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                          statusChoice === "Disponível"
                            ? "border-emerald-500 bg-emerald-50/20"
                            : "border-slate-205 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <CheckCircle
                            className={`w-5 h-5 ${
                              statusChoice === "Disponível"
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          />
                          {statusChoice === "Disponível" && (
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
                        onClick={() => setStatusChoice("Limpeza")}
                        className={`p-3.5 border rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                          statusChoice === "Limpeza"
                            ? "border-amber-500 bg-amber-50/20"
                            : "border-slate-205 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <RefreshCw
                            className={`w-5 h-5 ${
                              statusChoice === "Limpeza"
                                ? "text-amber-500"
                                : "text-slate-400"
                            }`}
                          />
                          {statusChoice === "Limpeza" && (
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

                      {/* Manutenção */}
                      <div
                        onClick={() => setStatusChoice("Manutenção")}
                        className={`p-3.5 border rounded-xl flex flex-col justify-between cursor-pointer transition-all ${
                          statusChoice === "Manutenção"
                            ? "border-red-500 bg-red-50/20"
                            : "border-slate-205 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <Wrench
                            className={`w-5 h-5 ${
                              statusChoice === "Manutenção"
                                ? "text-red-600"
                                : "text-slate-400"
                            }`}
                          />
                          {statusChoice === "Manutenção" && (
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
                          {selectedEnv.withdrawalTime || "08:30"}
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
                        setSelectedEnv(null);
                        setAction(null);
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
