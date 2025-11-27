import { InspectionItem, User, Project, APR, APRStatus } from './types';

export const CURRENT_USER: User = {
  name: "Carlos Silva",
  role: "TST"
};

// Moved Mock Projects to storageService initialization, keeping here only for type reference or fallback if needed
export const APP_ROUTES = {
  HOME: '/dashboard',
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROJECTS: '/projects',
  PROJECT_NEW: '/projects/new',
  PROJECT_EDIT: '/projects/edit/:id',
  PROJECT_DETAILS: '/projects/:id',
  INSPECTION_LIST: '/inspections',
  INSPECTION_NEW: '/inspection/new',
  INSPECTION_DETAILS: '/inspections/:id',
  APR_LIST: '/apr/list',
  APR_DETAILS: '/apr/:id',
  APR_NEW: '/apr/new',
  PROFILE: '/profile'
};

// Initial data for storage service initialization
export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Obra Alpha - Residencial Park',
    address: 'Av. das Nações, 1500 - Centro',
    status: 'Ativo',
    safetyScore: 98,
    progress: 45,
    manager: 'Eng. Roberto'
  },
  {
    id: '2',
    name: 'Obra Beta - Complexo Industrial',
    address: 'Rodovia BR-101, Km 50',
    status: 'Ativo',
    safetyScore: 85,
    progress: 12,
    manager: 'Eng. Amanda'
  },
  {
    id: '3',
    name: 'Manutenção Predial Sede',
    address: 'Rua 15 de Novembro, 200',
    status: 'Pausado',
    safetyScore: 100,
    progress: 90,
    manager: 'Sup. Pedro'
  }
];

export const MOCK_INSPECTION_TEMPLATE: InspectionItem[] = [
  { id: '1', question: 'Os colaboradores estão utilizando os EPIs adequados?', status: null },
  { id: '2', question: 'A área está isolada e sinalizada corretamente?', status: null },
  { id: '3', question: 'Ferramentas elétricas possuem proteção e aterramento?', status: null },
  { id: '4', question: 'Trabalho em altura possui linha de vida instalada?', status: null },
  { id: '5', question: 'Extintores de incêndio estão desobstruídos e válidos?', status: null },
];

export const MOCK_APRS: APR[] = [
  {
    id: '1',
    taskName: 'Soldagem em Tubulação',
    status: APRStatus.APPROVED,
    date: '10/10/2023',
    location: 'Oficina Central',
    description: 'Soldagem TIG em tubulação de aço carbono de 4 polegadas. Necessário isolamento térmico da área.',
    projectId: '1',
    risks: [
      { risk: 'Inalação de fumos metálicos', control: 'Exaustão localizada e ventilação natural', ppe: ['Máscara PFF2', 'Óculos de proteção'] },
      { risk: 'Queimaduras', control: 'Uso de biombo de proteção', ppe: ['Luva de raspa', 'Avental de raspa', 'Mangote'] },
      { risk: 'Radiação UV', control: 'Isolamento da área com cortinas inactinicas', ppe: ['Máscara de solda automática'] }
    ],
    teamSignatures: [
      { role: 'Soldador', name: 'João Santos', date: '10/10/2023 08:00', signed: true },
      { role: 'Auxiliar', name: 'Pedro Costa', date: '10/10/2023 08:05', signed: true }
    ],
    approverSignature: { role: 'TST', name: 'Carlos Silva', date: '10/10/2023 08:30', signed: true }
  },
  {
    id: '2',
    taskName: 'Trabalho em Altura - Andaime',
    status: APRStatus.PENDING_APPROVAL,
    date: '12/10/2023',
    location: 'Fachada Norte',
    description: 'Montagem de andaime fachadeiro para pintura externa no 3º pavimento.',
    projectId: '1',
    risks: [
      { risk: 'Queda de nível', control: 'Instalação de linha de vida e guarda-corpo', ppe: ['Cinto tipo paraquedista', 'Talabarte duplo'] },
      { risk: 'Queda de materiais', control: 'Isolamento da área abaixo do andaime', ppe: ['Capacete com jugular'] }
    ],
    teamSignatures: [
      { role: 'Montador', name: 'Marcos Oliveira', date: '12/10/2023 07:30', signed: true }
    ],
    approverSignature: { role: 'TST', name: 'Carlos Silva', date: '', signed: false }
  },
  {
    id: '3',
    taskName: 'Espaço Confinado - Tanque 3',
    status: APRStatus.DRAFT,
    date: '13/10/2023',
    location: 'Área de Tanques',
    description: 'Limpeza interna do tanque de armazenamento de água pluvial.',
    projectId: '2',
    risks: [],
    teamSignatures: []
  },
  {
    id: '4',
    taskName: 'Manutenção Elétrica QGBT',
    status: APRStatus.REJECTED,
    date: '09/10/2023',
    location: 'Subestação',
    description: 'Reaperto de conexões no quadro geral de baixa tensão.',
    projectId: '1',
    risks: [
      { risk: 'Choque Elétrico', control: 'Desenergização e Bloqueio (LOTO)', ppe: ['Luva isolante classe 0', 'Manga isolante', 'Capacete classe B'] }
    ],
    teamSignatures: [
      { role: 'Eletricista', name: 'Roberto Almeida', date: '09/10/2023 09:00', signed: true }
    ],
    approverSignature: { role: 'Eng. Segurança', name: 'Amanda Lima', date: '09/10/2023 10:00', signed: false }
  },
];