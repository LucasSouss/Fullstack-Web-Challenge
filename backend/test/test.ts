import { assert } from "poku";
import { ProjectService } from "../src/services/ProjectService.ts";


console.log("Testando: ProjectService...");

async function testProjectService() {
  try {
    // Teste de Criação
    const novoProjeto = await ProjectService.create("Projeto de Teste Poku");
    assert.ok(novoProjeto.id, "O projeto criado deve ter um ID");
    assert.equal(novoProjeto.name, "Projeto de Teste Poku", "O nome do projeto deve ser o mesmo enviado");

    // Teste de Listagem
    const projetos = await ProjectService.listAll();
    assert.ok(Array.isArray(projetos), "listAll deve retornar um Array");
    assert.ok(projetos.length > 0, "A lista de projetos não deve estar vazia");

    // Teste de Atualização
    const projetoAtualizado = await ProjectService.update(novoProjeto.id, "Nome Atualizado");
    assert.equal(projetoAtualizado.name, "Nome Atualizado", "O nome deve ter sido alterado");

    // Teste de Exclusão
    await ProjectService.delete(novoProjeto.id);
    const listaAposExclusao = await ProjectService.listAll();
    const existe = listaAposExclusao.find(p => p.id === novoProjeto.id);
    assert.ok(!existe, "O projeto não deve mais existir na lista após delete");

    console.log("✅ ProjectService: OK");
  } catch (error) {
    console.error(" Falha nos testes de ProjectService:", error);
    process.exit(1);
  }
}

// 2. TESTE DE INTEGRIDADE DAS ROTAS (CONTRATO)

console.log("Testando: Integridade das Rotas...");

import { router } from "../src/routes/index.ts";

const rotasEsperadas = [
  { path: '/projects', method: 'get' },
  { path: '/projects', method: 'post' },
  { path: '/tasks', method: 'post' },
  { path: '/tasks/update-overdue', method: 'get' }
];

const stack = router.stack.map((layer: any) => ({
  path: layer.route?.path,
  method: Object.keys(layer.route?.methods || {})[0]
}));

rotasEsperadas.forEach(esperada => {
  const existe = stack.some(s => s.path === esperada.path && s.method === esperada.method);
  assert.ok(existe, `A rota ${esperada.method.toUpperCase()} ${esperada.path} deve estar definida`);
});

console.log("✅ Rotas: OK");

// Executar testes assíncronos
testProjectService();