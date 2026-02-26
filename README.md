# 📋 **Gerenciador de Projetos e Tarefas**

Aplicação fullstack para gerenciamento de projetos e tarefas, desenvolvida como teste técnico para posição júnior.

---

## 📑 **Índice**

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Backend](#backend)
  - [Estrutura de Diretórios](#estrutura-de-diretórios-backend)
  - [Modelo de Dados](#modelo-de-dados)
  - [API - Endpoints](#api---endpoints)
  - [Validações](#validações)
- [Frontend](#frontend)
  - [Estrutura de Diretórios](#estrutura-de-diretórios-frontend)
  - [Componentes](#componentes)
  - [Funcionalidades](#funcionalidades)
  - [Fluxo de Dados](#fluxo-de-dados)
- [Design System](#design-system)
- [Testes](#testes)
- [Configuração e Execução](#configuração-e-execução)
- [Scripts Disponíveis](#scripts-disponíveis)

---

## 👁️ **Visão Geral**

O **Gerenciador de Projetos e Tarefas** é uma aplicação fullstack que permite:

- Criar, editar, visualizar e excluir projetos
- Gerenciar tarefas dentro de cada projeto
- Filtrar tarefas por status (Pendentes, Concluídas, Vencidas)
- Receber notificações automáticas sobre tarefas próximas do vencimento ou vencidas
- Visualizar estatísticas em tempo real

---

## 🛠️ **Tecnologias Utilizadas**

### Backend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Node.js | 18+ | Ambiente de execução |
| Express | 5.2.1 | Framework web |
| TypeScript | 5.9.3 | Tipagem estática |
| Prisma | 6.19 | ORM |
| MongoDB | - | Banco de dados |
| Zod | 4.3.6 | Validação de dados |
| Poku | 3.0.2 | Test runner |

### Frontend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Next.js | 14.2.5 | Framework React |
| React | 18 | Biblioteca UI |
| Axios | 1.7.2 | Cliente HTTP |
| React Icons | 5.5.0 | Ícones |
| CSS Modules | - | Estilização |
| Poku | 3.0.2 | Test runner |

---

## 🏛️ **Arquitetura do Projeto**

```
projeto/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── test/
└── frontend/
    ├── app/
    ├── components/
    │   ├── common/
    │   ├── projects/
    │   └── tasks/
    ├── services/
    ├── hooks/
    ├── utils/
    └── test/
```

---

## 🔧 **Backend**

### Estrutura de Diretórios Backend

```
backend/
├── src/
│   ├── controllers/
│   │   ├── ProjectController.ts    # CRUD de projetos
│   │   └── TaskController.ts       # CRUD de tarefas e atualização de status
│   ├── services/
│   │   └── ProjectService.ts       # Camada de serviço para projetos
│   ├── routes/
│   │   └── index.ts                # Definição de todas as rotas da API
│   └── server.ts                    # Configuração do Express e middlewares
├── prisma/
│   ├── schema.prisma                # Modelo de dados
│   └── migrations/                  # Migrações do banco de dados
├── test/
│   └── test.ts                       # Testes unitários
├── .env                               # Variáveis de ambiente
└── package.json
```

### Modelo de Dados

```prisma
// prisma/schema.prisma
model Project {
  id        String   @id @default(cuid())
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id          String   @id @default(cuid())
  title       String
  responsible String
  dueDate     DateTime
  status      Status   @default(PENDENTE)
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status {
  PENDENTE
  CONCLUIDA
  VENCIDA
}
```

### API - Endpoints

#### Projetos (`/api/projects`)

| Método | Rota | Descrição | Controller | Corpo da Requisição |
|--------|------|-----------|------------|---------------------|
| GET | `/projects` | Lista todos os projetos com suas tarefas | `index` | - |
| POST | `/projects` | Cria um novo projeto | `store` | `{ "name": "string" }` |
| PUT | `/projects/:id` | Atualiza um projeto | `update` | `{ "name": "string" }` |
| DELETE | `/projects/:id` | Remove um projeto | `destroy` | - |

#### Tarefas (`/api/tasks`)

| Método | Rota | Descrição | Controller | Corpo da Requisição |
|--------|------|-----------|------------|---------------------|
| POST | `/tasks` | Cria nova tarefa | `store` | `{ "title": "string", "responsible": "string", "dueDate": "YYYY-MM-DD", "projectId": "string" }` |
| PUT | `/tasks/:id` | Atualiza tarefa | `update` | `{ "title"?: "string", "responsible"?: "string", "dueDate"?: "YYYY-MM-DD", "status"?: "PENDENTE" \| "CONCLUIDA" \| "VENCIDA" }` |
| DELETE | `/tasks/:id` | Remove tarefa | `destroy` | - |
| PATCH | `/tasks/:id/complete` | Marca como concluída | `complete` | `{ "status"?: "PENDENTE" \| "CONCLUIDA" \| "VENCIDA" }` |
| PATCH | `/tasks/:id/status` | Atualiza status | `updateStatus` | `{ "status": "PENDENTE" \| "CONCLUIDA" \| "VENCIDA" }` |
| GET | `/tasks/update-overdue` | Atualiza tarefas vencidas | `updateOverdueTasks` | - |

### Validações

Todas as rotas utilizam **Zod** para validação:

**Criação de Tarefa:**
```typescript
const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  responsible: z.string().min(1, "Responsável é obrigatório"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato deve ser YYYY-MM-DD"),
  projectId: z.string().min(1, "ID do projeto é obrigatório"),
  status: z.enum(["PENDENTE", "CONCLUIDA", "VENCIDA"]).optional()
});
```

**Criação de Projeto:**
```typescript
const projectSchema = z.object({
  name: z.string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres")
    .transform(val => val.trim())
});
```

---

## 🎨 **Frontend**

### Estrutura de Diretórios Frontend

```
frontend/
├── app/
│   ├── page.jsx                    # Página principal
│   ├── layout.jsx                   # Layout raiz
│   ├── globals.css                   # Estilos globais
│   └── page.module.css               # Estilos da página principal
├── components/
│   ├── common/
│   │   ├── Modal.jsx                 # Modal reutilizável
│   │   ├── Modal.module.css
│   │   ├── Loading.jsx               # Indicador de carregamento
│   │   ├── Loading.module.css
│   │   ├── Notification.jsx          # Sistema de notificações
│   │   └── Notification.module.css
│   ├── projects/
│   │   ├── ProjectList.jsx           # Lista de projetos na sidebar
│   │   ├── ProjectList.module.css
│   │   ├── ProjectCard.jsx           # Card detalhado de projeto
│   │   ├── ProjectCard.module.css
│   │   ├── ProjectForm.jsx           # Formulário de projeto
│   │   └── ProjectForm.module.css
│   └── tasks/
│       ├── TaskList.jsx              # Lista de tarefas com filtros
│       ├── TaskList.module.css
│       ├── TaskItem.jsx              # Item individual de tarefa
│       ├── TaskItem.module.css
│       ├── TaskForm.jsx              # Formulário de tarefa
│       └── TaskForm.module.css
├── services/
│   ├── api.js                        # Configuração do Axios
│   ├── projectService.js              # CRUD de projetos
│   ├── taskService.js                 # CRUD de tarefas
│   └── taskUtilsService.js            # Utilitários (updateOverdueTasks)
├── hooks/
│   └── useNotifications.js            # Hook de notificações
├── utils/
│   └── dateUtils.js                   # Funções de manipulação de datas
├── test/
│   └── test.js                        # Testes unitários
└── package.json
```

### Componentes

#### ProjectList (Sidebar)
- Lista todos os projetos
- Botão principal para selecionar projeto
- Ícone de edição (lápis) e exclusão (X)
- Destaque visual para projeto selecionado

#### TaskList
- Cabeçalho com nome do projeto e estatísticas
- Filtros: Todas, Pendentes, Concluídas, Vencidas
- Lista de tarefas com botão de edição
- Botão "Adicionar Tarefa"
- Modais para criação/edição/exclusão

#### TaskItem
- Checkbox para alternar entre Pendente/Concluída
- Título e responsável
- Data de vencimento com destaque (vermelho se vencida, amarelo se próxima)
- Badge de status colorido

#### TaskForm
- Campos: Título, Responsável, Data de Conclusão
- Validação local (campos obrigatórios)
- Prevenção de datas passadas (criação)
- Modo edição com dados pré-preenchidos

#### Modal
- Overlay com blur
- Cabeçalho com título e botão fechar
- Área de conteúdo
- Rodapé opcional com botões Cancelar/Confirmar

#### Notification
- Posicionamento fixo (topo direito)
- Tipos: overdue (vermelho) e nearDue (amarelo)
- Botão para fechar individualmente
- Animação de entrada

### Funcionalidades

#### Página Principal
- **Sidebar (Projetos)**
  - Listagem de todos os projetos
  - Seleção de projeto para visualizar tarefas
  - Edição de projeto (modal com formulário)
  - Exclusão com confirmação
  - Botão "Novo Projeto"

- **Área de Conteúdo (Tarefas)**
  - Exibição das tarefas do projeto selecionado
  - Filtros por status com contadores
  - Estatísticas em pills coloridas
  - CRUD completo de tarefas

#### Sistema de Notificações
O hook `useNotifications` monitora automaticamente as tarefas:

```javascript
// Dispara notificação quando:
- Tarefa não concluída com data passada → tipo 'overdue' (🔴)
- Tarefa não concluída com vencimento em até 2 dias → tipo 'nearDue' (🟡)

// Características:
- Verificação inicial ao carregar
- Verificação a cada 5 minutos
- Controle de duplicação (não repete a mesma notificação)
```

#### Utilitários de Data
```javascript
// Principais funções em dateUtils.js:
- formatDate()      // ISO → "dd/mm/aaaa"
- parseLocalDate()  // "YYYY-MM-DD" → Date object
- toISODateString() // Date → "YYYY-MM-DD"
- isOverdue()       // Verifica se data já passou
- isNearDue(days)   // Verifica se vence em até X dias
- getStatusText()   // "PENDENTE" → "Pendente"
- getStatusFromDate() // Determina status baseado na data
```

### Fluxo de Dados

1. **Carregamento Inicial**
```
Página carrega → updateOverdueTasks() → listAll() → Renderiza projetos
```

2. **Seleção de Projeto**
```
Usuário clica no projeto → setSelectedProject() → Renderiza TaskList
```

3. **Operações CRUD**
```
Usuário executa ação → Chamada ao serviço → loadData() → Recarrega dados
```

4. **Atualização Automática de Status**
```javascript
// TaskList normaliza status baseado na data
const normalizedTasks = tasks.map(task => {
  if (task.status !== 'CONCLUIDA') {
    const newStatus = getStatusFromDate(task.dueDate);
    if (newStatus !== task.status) {
      return { ...task, status: newStatus };
    }
  }
  return task;
});
```

### Camada de Serviços

**api.js**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
});

api.interceptors.response.use(
  response => {
    console.log('Resposta:', response.data);
    return response;
  },
  error => {
    console.error('Erro:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
```

**projectService.js**
```javascript
import api from './api';

const projectService = {
  async listAll() { return (await api.get('/projects')).data; },
  async create(name) { return (await api.post('/projects', { name })).data; },
  async update(id, name) { return (await api.put(`/projects/${id}`, { name })).data; },
  async delete(id) { return (await api.delete(`/projects/${id}`)).data; }
};

export default projectService;
```

**taskService.js**
```javascript
import api from './api';

const taskService = {
  async create(taskData) { return (await api.post('/tasks', taskData)).data; },
  async update(id, taskData) { return (await api.put(`/tasks/${id}`, taskData)).data; },
  async complete(id) { return (await api.patch(`/tasks/${id}/complete`)).data; },
  async delete(id) { return (await api.delete(`/tasks/${id}`)).data; }
};

export default taskService;
```

**taskUtilsService.js**
```javascript
import api from './api';

const taskUtilsService = {
  async updateOverdueTasks() { return (await api.get('/tasks/update-overdue')).data; }
};

export default taskUtilsService;
```

---

## 🎯 **Design System**

### Cores (Variáveis CSS)
```css
:root {
  --bg-main: #0f172a;      /* Fundo principal */
  --bg-card: #1e293b;       /* Cards */
  --bg-input: #334155;      /* Inputs */
  --text-main: #f8fafc;     /* Texto principal */
  --text-secondary: #94a3b8;/* Texto secundário */
  --accent: #3b82f6;        /* Azul - Ações */
  --success: #22c55e;       /* Verde - Concluído */
  --warning: #eab308;       /* Amarelo - Próximo */
  --danger: #ef4444;        /* Vermelho - Vencido/Exclusão */
}
```

### Componentes Visuais

| Componente | Estilo |
|------------|--------|
| **Sidebar** | Fundo `#1e293b`, borda direita `#334155` |
| **ProjectList** | Cards com borda, hover com elevação |
| **ProjectCard** | Hover com elevação, preview da primeira tarefa |
| **TaskItem** | Fundo `--bg-card`, hover com borda `--accent` |
| **Status Badges** | Fundos semi-transparentes coloridos |
| **Modal** | Overlay escuro com blur, fundo `#1e293b` |
| **Notification** | Cards flutuantes, vermelho/amarelo |
| **Loading** | Spinner azul animado |

### Tipografia
- Fonte principal: sistema (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto...`)
- Títulos: bold, letter-spacing quando necessário
- Texto secundário: cor `--text-secondary`

---

## 🧪 **Testes**

### Backend (`backend/test/test.ts`)

```typescript
// Testes do ProjectService
- Criar projeto (verifica ID e nome)
- Listar projetos (verifica array)
- Atualizar projeto (verifica nome alterado)
- Excluir projeto (verifica remoção)

// Testes de rotas
- Verifica existência das rotas principais
```

### Frontend (`frontend/test/test.js`)

```javascript
// Testes de utilitários de data
- formatDate() → "31/12/2026"
- isOverdue() → true para data antiga
- isNearDue() → true para amanhã
- toISODateString() → "2025-05-20"
- getStatusText() → "Concluída"

// Testes de serviços
- Verifica métodos existentes em projectService
- Verifica métodos existentes em taskService

// Testes de lógica de interface
- Cálculo de filtros (concluídas, pendentes, vencidas)
```

### Executar Testes

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

---

## 🚀 **Configuração e Execução**

### Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn
- .env: DATABASE_URL="mongodb+srv://lucsouss:eKW277sbSshxXHKn@spdb0.dw73gqf.mongodb.net/SPdb0
?appName=SPdb0"

### Passo a Passo

#### 1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd [nome-do-projeto]
```

#### 2. Configure o Backend
```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações:

# Executar migrações do Prisma
npx prisma migrate dev --name init

# Iniciar servidor de desenvolvimento
npm run dev
```

#### 3. Configure o Frontend
```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

#### 4. Acesse a aplicação
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

---

## 📜 **Scripts Disponíveis**

### Backend
| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor com hot-reload (tsx) |
| `npm run test` | Executa testes com Poku |

### Frontend
| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor Next.js |
| `npm run build` | Gera build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |
| `npm run test` | Executa testes com Poku |

---

## 📁 **Variáveis de Ambiente**



### Frontend
As configurações da API estão no arquivo `services/api.js`:
```javascript
baseURL: 'http://localhost:3001/api'
```

---

## 🗄️ **Banco de Dados**

### Comandos Prisma Úteis

```bash
# Criar migração após alterar schema
npx prisma migrate dev --name nome_da_migracao

# Visualizar dados no navegador
npx prisma studio

# Gerar cliente Prisma
npx prisma generate

# Resetar banco de dados
npx prisma migrate reset
```

---

## 📊 **Resumo do Projeto**

| Categoria | Descrição |
|-----------|-----------|
| **Tipo** | Aplicação Fullstack |
| **Backend** | API REST com Node.js/Express |
| **Frontend** | SPA com Next.js/React |
| **Banco de Dados** | MongoDB com Prisma ORM |
| **Validação** | Zod |
| **Testes** | Poku |
| **Estilização** | CSS Modules |
| **Funcionalidades** | CRUD de projetos e tarefas, filtros, notificações |

---

## ✨ **Funcionalidades em Destaque**

1. **Gerenciamento Completo**
   - CRUD de projetos
   - CRUD de tarefas
   - Relacionamento projeto-tarefas

2. **Interface Intuitiva**
   - Sidebar com lista de projetos
   - Filtros por status
   - Estatísticas visuais

3. **Sistema Inteligente**
   - Atualização automática de status vencidos
   - Notificações em tempo real
   - Validação de datas

4. **Experiência do Usuário**
   - Modais para ações
   - Confirmação para exclusões
   - Loading states
   - Feedback visual

---

## 📝 **Licença**

Este projeto foi desenvolvido para fins de avaliação técnica. Todos os direitos reservados.

---

**Desenvolvido para teste técnico fullstack júnior** 🚀
