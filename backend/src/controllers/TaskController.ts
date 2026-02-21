import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
          dueDate: new Date(dueDate),
          projectId,
          status: "PENDENTE"
        }
      });
      return res.status(201).json(task);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar tarefa. Verifique o ID do projeto." });
    }
  },

  async complete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await prisma.task.update({
        where: { id: String(id) },
        data: { status: "CONCLUIDA" }
      });
      return res.json(task);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao concluir tarefa." });
    }
  },

  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.task.delete({ where: { id: String(id) } });
    } catch (error) {
      return res.status(400).json({ error: "Erro ao excluir tarefa." });
    }
  }
};