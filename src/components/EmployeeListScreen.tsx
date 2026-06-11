import React, { useState } from "react";
import { Employee, ScreenType, TransitionType, UserAccount } from "../types";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Search, Trash2, Users } from "lucide-react";

interface Props {
  onNavigate: (screen: ScreenType, transition: TransitionType) => void;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  currentUser?: UserAccount;
  onLogout: () => void;
}

export default function EmployeeListScreen({
  onNavigate,
  employees,
  setEmployees,
  currentUser,
  onLogout,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter((emp) =>
    `${emp.fullName} ${emp.email} ${emp.registration}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Deseja realmente excluir este funcionário?",
    );

    if (!confirmDelete) return;

    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case "admin":
        return "bg-red-100 text-red-700";

      case "staff":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        currentScreen="employees"
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <div className="pl-[260px] min-h-screen flex flex-col">
        <Header
          title="Funcionários"
          userFullName={currentUser?.fullName}
          profilePicture={currentUser?.profilePicture}
        />

        <main className="p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Gestão de Funcionários
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Visualize e gerencie os funcionários cadastrados.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="text"
                placeholder="Buscar funcionário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center gap-2">
              <Users size={18} />
              <span className="font-semibold">
                {filteredEmployees.length} funcionário(s)
              </span>
            </div>

            {filteredEmployees.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                Nenhum funcionário encontrado.
              </div>
            ) : (
              <div className="divide-y">
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={emp.profilePicture}
                        alt={emp.fullName}
                        className="w-14 h-14 rounded-full object-cover border"
                      />

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {emp.fullName}
                        </h3>

                        <p className="text-sm text-slate-500">{emp.email}</p>

                        <p className="text-xs text-slate-400">
                          Matrícula: {emp.registration}
                        </p>

                        <p className="text-xs text-slate-400">
                          Cargo: {emp.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getAccessColor(
                          emp.accessLevel,
                        )}`}
                      >
                        {emp.accessLevel}
                      </span>

                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
