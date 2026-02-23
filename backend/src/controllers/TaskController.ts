import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper para parsear data no formato YYYY-MM-DD como UTC
const parseLocalDate = (dateString: string): Date => {
  // dateString vem como "2026-02-23"
  // Converte para UTC 00:00:00
  return new Date(`${dateString}T00:00:00Z`);
};

export const TaskController = {
  async store(req: Request, res: Response) {
    try {
      const { title, responsible, dueDate, projectId } = req.body;

      if (!title || !responsible || !dueDate) { 
        return res.status(400).json({ error: "Dados incompletos para a tarefa." });
      }

      const task = await prisma.task.create({
        data: {
          title,
          responsible,
          dueDate: parseLocalDate(dueDate),
          projectId: String(projectId),
          status: "PENDENTE"
        }
      });
      return res.status(201).json(task);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      return res.status(400).json({ error: "Erro ao criar tarefa. Verifique o ID do projeto." });
    }
  },

  // No TaskController.ts
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body; // Recebe o novo status (PENDENTE ou CONCLUIDA)
      
      const task = await prisma.task.update({
        where: { id: String(id) },
        data: { status: status }
      });
      return res.json(task);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar status da tarefa." });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, responsible, dueDate, status } = req.body;

      const data: any = {};
      if (title !== undefined) data.title = title;
      if (responsible !== undefined) data.responsible = responsible;
      if (dueDate !== undefined && dueDate !== null) data.dueDate = parseLocalDate(dueDate);
      if (status !== undefined) data.status = status;

      const task = await prisma.task.update({
        where: { id: String(id) },
        data
      });
      return res.json(task);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return res.status(400).json({ error: "Erro ao editar tarefa." });
    }
  },

  async complete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body; // ACRESCENTADO: Pega o status enviado pelo front

      const task = await prisma.task.update({
        where: { id: String(id) },
        data: { status: status || "CONCLUIDA" } // ALTERADO: Usa o status do body ou o padrão
      });
      return res.json(task);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar status da tarefa." });
    }
  },

  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('Tentando deletar tarefa:', id);
      await prisma.task.delete({ 
        where: { id: String(id) } });
      console.log('Tarefa deletada com sucesso:', id);
      return res.status(200).json({ message: 'Tarefa excluída com sucesso.', id });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      return res.status(400).json({ error: "Erro ao excluir tarefa." });
    }
  }
};