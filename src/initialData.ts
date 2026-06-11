/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Employee, Environment, ActivityLog } from './types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    fullName: 'Carlos Almeida',
    email: 'carlos.almeida@senac.br',
    registration: '883.102-4',
    sector: 'acad',
    role: 'Coordenador Pedagógico',
    accessLevel: 'admin',
    createdAt: '2026-01-15',
    profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE95MEnCFFpm_CN56dmE8T3Mon2Ct__rSbvtNnbrCPQdfre2nKD9fpPSF4zMuI2cLd7mcJ8mEjoBf9p7mvULPREAjrwQ8Rp88LRG9mZRjOdbqTpUPDVD9zSPvwIqrAqstoiP5mw-eCoYRZ4mgllYHvSd92uZuoqIvn4hQbKAFclXXvOJCheilZ2z0HlDL01mgbnF1maMSkWHGOpCaxSYa-nMwJZg8xXSMmPNKdRLQl9PYxqPak3xA9GAcqLoHm7Ry1mFyTsdncoGQ'
  },
  {
    id: 'EMP-002',
    fullName: 'Maria Silva',
    email: 'maria.silva@senac.br',
    registration: '402.115-9',
    sector: 'adm',
    role: 'Auxiliar Administrativo',
    accessLevel: 'staff',
    createdAt: '2026-02-10',
    profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0Mo9hweztQvkQdaRJ8ABjVbJlcdDnasggDeYxhR7ds0oYM2XmM9uyJrUBoaYyjHsXfLbeME1uYY8-AcbiIC0UUlT6Z-PVvnI4gTLKuFfuUbeV5lsGP5P7mv-H1bYAFcSUkvNS7oEnj8eIfaj86XDi0I4v2oST8lf8lormT6im3o5xsfibmUURLpqCSGQdRIvWjwY9cW2J4OW7p21HDvLVMPNtuTOc1MGopjlI3CqKPa75v2yGa0rApIajNUTswg1BDJcV7qjAFqg'
  },
  {
    id: 'EMP-003',
    fullName: 'Carlos Eduardo',
    email: 'carlos.eduardo@senac.br',
    registration: '203.447-1',
    sector: 'ti',
    role: 'Analista de Sistemas',
    accessLevel: 'staff',
    createdAt: '2026-03-22',
    profilePicture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRPV7a5s_okWDlED3by-aiI9J0GVGin6d7Z8di000e7Jd9KMjopBDcsoYsIFc8WfObDHyesR8mCl-TUCyV7CLCvFYia7-VOQbT86yDrGtHfo05plm-ZKM2dOfDxqRUbu4nxQW3gnnqgT46PliSgeG__i3lT5giXTIeOt_v35ge2QBnX7Nqiz_cb95wXoxs-MWZPABZFmZmTtAm2Zi0rynuXyJ2Y7cwVcng1BOREYBimCBx0DroptudGkF42J7ZamXMDiQVDor_D20'
  }
];

export const INITIAL_ENVIRONMENTS: Environment[] = [
  {
    id: 'LAB-01',
    keyId: 'LAB-01',
    name: 'Laboratório de Informática 01',
    block: 'Bloco Tecnológico',
    floor: '1º Andar',
    capacity: 25,
    resources: ['Ar Condicionado', 'Projetor', 'Computadores'],
    status: 'Disponível'
  },
  {
    id: 'AUD-01',
    keyId: 'AUD-01',
    name: 'Auditório Principal',
    block: 'Bloco Administrativo',
    floor: 'Térreo',
    capacity: 150,
    resources: ['Ar Condicionado', 'Projetor', 'Quadro Branco'],
    status: 'Ocupado',
    currentResponsible: 'Dept. Cultura'
  },
  {
    id: 'COZ-PED',
    keyId: 'COZ-PED',
    name: 'Cozinha Pedagógica',
    block: 'Bloco de Serviços',
    floor: 'Térreo',
    capacity: 12,
    resources: ['Ar Condicionado', 'Equipamento Gastronômico'],
    status: 'Limpeza',
    currentResponsible: 'Equipe Manutenção'
  },
  {
    id: 'GAS-102',
    keyId: 'GAS-102',
    name: 'Laboratório de Gastronomia',
    block: 'Bloco de Serviços',
    floor: '1º Andar',
    capacity: 25,
    resources: ['Equipamento Gastronômico'],
    status: 'Manutenção'
  },
  {
    id: 'RED-04',
    keyId: 'RED-04',
    name: 'Lab de Redes - 04',
    block: 'Bloco Tecnológico',
    floor: '2º Andar',
    capacity: 30,
    resources: ['Ar Condicionado', 'Projetor', 'Computadores', 'Hack de Redes'],
    status: 'Disponível'
  },
  {
    id: 'L-02',
    keyId: 'L-02',
    name: 'Lab. Design (L-02)',
    block: 'Bloco Tecnológico',
    floor: 'Térreo',
    capacity: 20,
    resources: ['Ar Condicionado', 'Projetor', 'Computadores', 'Mesa de Desenho'],
    status: 'Ocupado',
    currentResponsible: 'Prof. Carlos Eduardo'
  },
  {
    id: 'AUD-C',
    keyId: 'AUD-C',
    name: 'Auditório C',
    block: 'Bloco Administrativo',
    floor: '2º Andar',
    capacity: 80,
    resources: ['Ar Condicionado', 'Projetor'],
    status: 'Ocupado',
    currentResponsible: 'Suporte Operacional'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: 'Hoje, 09:42:15',
    userInitials: 'RS',
    userName: 'Ricardo Santos',
    action: 'Retirada de Chave',
    resource: 'Lab de Redes - 04',
    status: 'Sucesso'
  },
  {
    id: 'log-2',
    timestamp: 'Hoje, 09:30:02',
    userInitials: 'AM',
    userName: 'Ana Maria',
    action: 'Devolução',
    resource: 'Auditório Principal',
    status: 'Sucesso'
  },
  {
    id: 'log-3',
    timestamp: 'Hoje, 08:15:44',
    userInitials: '??',
    userName: 'UID 8832-XA',
    action: 'Tentativa Negada',
    resource: 'CPD Server Room',
    status: 'Crítico'
  },
  {
    id: 'log-4',
    timestamp: 'Ontem, 18:05:12',
    userInitials: 'JF',
    userName: 'Jorge Filho',
    action: 'Devolução',
    resource: 'Sala 102 - Bloco B',
    status: 'Sucesso'
  },
  {
    id: 'log-5',
    timestamp: 'Ontem, 17:40:22',
    userInitials: 'ML',
    userName: 'Maria Luiza',
    action: 'Retirada de Chave',
    resource: 'Lab Estética 01',
    status: 'Sucesso'
  }
];
