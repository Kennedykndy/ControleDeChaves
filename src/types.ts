/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenType =
  | "login"
  | "register"
  | "dashboard"
  | "add-employee"
  | "employees"
  | "add-key"
  | "reports";

export type TransitionType = "push" | "push_back" | "slide_up" | "none";

export interface UserAccount {
  fullName: string;
  email: string;
  registration: string;
  password?: string;
  profilePicture?: string;
}

export type AccessLevel = "admin" | "staff" | "viewer";

export interface Employee {
  id: string; // Generated or registration
  fullName: string;
  email: string;
  registration: string;
  sector: string;
  role: string;
  notes?: string;
  accessLevel: AccessLevel;
  profilePicture?: string;
  createdAt: string;
}

export type EnvironmentStatus =
  | "Disponível"
  | "Ocupado"
  | "Limpeza"
  | "Manutenção";

export interface Environment {
  id: string; // key_id, e.g. AUD-01, CHV-402-A
  name: string;
  block: string;
  floor: string;
  capacity: number;
  resources: string[]; // ['Ar Condicionado', 'Projetor', etc]
  status: EnvironmentStatus;
  currentResponsible?: string;
  keyId: string;
  withdrawalTime?: string; // e.g. "14:15"
}

export interface ActivityLog {
  id: string;
  timestamp: string; // formatted time, e.g. "Hoje, 09:42:15"
  userInitials: string;
  userName: string;
  action: string; // e.g. "Retirada de Chave", "Devolução", "Tentativa Negada"
  resource: string; // e.g. "Lab de Redes - 04"
  status: "Sucesso" | "Crítico" | "Info";
  responsiblePic?: string;
  duration?: string;
  timeLimitExceeded?: boolean;
  withdrawalTime?: string;
  returnTime?: string;
}
