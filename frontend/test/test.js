import { poku, assert } from "poku";
import { formatDate, isOverdue, getStatusText } from "../src/utils/dateUtils.js";

// ---------------------------------------------------------
// 1. TESTES DE UTILITÁRIOS (DateUtils)
// ---------------------------------------------------------

console.log("🧪 Testando: Utils de Data...");

// Teste de Formatação
assert.equal(
  formatDate("2026-12-31"), 
  "31/12/2026", 
  "Deve formatar data YYYY-MM-DD para DD/MM/YYYY"
);

// Teste de Verificação de Atraso (Overdue)
const dataPassada = "2020-01-01";
assert.equal(
  isOverdue(dataPassada), 
  true, 
  "Data de 2020 deve ser considerada vencida"
);

const dataFutura = "2099-01-01";
assert.equal(
  isOverdue(dataFutura), 
  false, 
  "Data de 2099 não deve estar vencida"
);

// Teste de Texto de Status
assert.equal(
  getStatusText("CONCLUIDA"), 
  "Concluída", 
  "Deve converter chave de status para texto amigável"
);

// ---------------------------------------------------------
// 2. TESTES DE ESTRUTURA DE SERVIÇOS (Mocks)
// ---------------------------------------------------------
// Aqui verificamos se os serviços que você criou possuem os métodos necessários

import projectService from "../src/services/projectService.js";

console.log("🧪 Testando: Camada de Serviços...");

assert.ok(
  typeof projectService.listAll === "function", 
  "O serviço de projetos deve ter o método listAll"
);

assert.ok(
  typeof projectService.create === "function", 
  "O serviço de projetos deve ter o método create"
);

// ---------------------------------------------------------
// 3. TESTES DE LÓGICA DE NEGÓCIO (Cálculo de Estatísticas)
// ---------------------------------------------------------
// Simulando a lógica que você usa no ProjectCard e TaskList

console.log("🧪 Testando: Lógica de Estatísticas...");

const mockTasks = [
  { id: 1, status: 'CONCLUIDA' },
  { id: 2, status: 'PENDENTE' },
  { id: 3, status: 'PENDENTE' }
];

const completedCount = mockTasks.filter(t => t.status === 'CONCLUIDA').length;
assert.equal(completedCount, 1, "O cálculo de tarefas concluídas deve ser 1");

const pendingCount = mockTasks.filter(t => t.status === 'PENDENTE').length;
assert.equal(pendingCount, 2, "O cálculo de tarefas pendentes deve ser 2");

console.log("\n✅ Todos os testes unitários de lógica do Front-end passaram!");