// 1. Bibliotecas externas
import { assert } from "poku";
import { 
  formatDate, 
  isOverdue, 
  isNearDue, 
  toISODateString,
  getStatusText 
} from "../src/utils/dateUtils.js";

// 3. Serviços (Comunicação com API)
import projectService from "../src/services/projectService.js";
import taskService from "../src/services/taskService.js";

// 1. TESTES DE UTILITÁRIOS
console.log("🧪 Testando: Utils de Data...");

// Teste de Formatação
assert.equal(formatDate("2026-12-31"), "31/12/2026", "Deve formatar data ISO para padrão BR");

// Teste de Verificação de Atraso
assert.equal(isOverdue("2020-01-01"), true, "Data antiga deve retornar Vencida (true)");
assert.equal(isOverdue("2099-01-01"), false, "Data futura não deve retornar Vencida (false)");

// Teste de Proximidade (Dinâmico)
const hoje = new Date();
const amanha = new Date(hoje);
amanha.setDate(hoje.getDate() + 1);
const amanhaStr = toISODateString(amanha);

assert.equal(isNearDue(amanhaStr, 2), true, "Data de amanhã deve estar 'perto'");

// Teste de Conversão de Objeto para String
const dataObjeto = new Date(2025, 4, 20); 
assert.equal(toISODateString(dataObjeto), "2025-05-20", "Deve converter objeto para YYYY-MM-DD");

// Teste de Texto de Status (Adicionado para usar o import)
assert.equal(getStatusText("CONCLUIDA"), "Concluída", "Deve retornar o texto amigável do status");

// 2. TESTES DE INTEGRIDADE DE SERVIÇOS
console.log("🧪 Testando: Camada de Serviços...");

const checarMetodos = (servico, nome, metodos) => {
  metodos.forEach(m => {
    assert.ok(typeof servico[m] === "function", `O serviço ${nome} deve possuir o método: ${m}`);
  });
};

checarMetodos(projectService, "ProjectService", ['listAll', 'create', 'update', 'delete']);
checarMetodos(taskService, "TaskService", ['create', 'update', 'complete', 'delete']);


// 3. TESTES DE LÓGICA DE INTERFACE

console.log("🧪 Testando: Lógica de Filtros...");

const tarefasMock = [
  { id: 1, status: 'CONCLUIDA' },
  { id: 2, status: 'PENDENTE' },
  { id: 3, status: 'VENCIDA' }
];

const totalConcluidas = tarefasMock.filter(t => t.status === 'CONCLUIDA').length;
assert.equal(totalConcluidas, 1, "Cálculo de concluídas deve ser 1");

console.log("\n✅ SUCESSO: Todos os testes de unidade passaram!");