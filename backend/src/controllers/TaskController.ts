import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();


// Esquema para criação de tarefas
const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  responsible: z.string().min(1, "Responsável é obrigatório"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data deve ser YYYY-MM-DD"),
  projectId: z.string().min(1, "ID do projeto é obrigatório"),
  status: z.enum(["PENDENTE", "CONCLUIDA", "VENCIDA"]).optional()
});

// Esquema para atualização parcial de tarefas
const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  responsible: z.string().min(1).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(["PENDENTE", "CONCLUIDA", "VENCIDA"]).optional()
});


const parseLocalDate = (dateString: string): Date => {
  return new Date(`${dateString}T00:00:00Z`);
};

export const TaskController = {
  
  // Atualiza tarefas vencidas no banco
  async updateOverdueTasks(req: Request, res: Response) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tasks = await prisma.task.findMany({
        where: {
          status: { not: "CONCLUIDA" }
        }
      });

      let updatedCount = 0;
      for (const task of tasks) {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate < today && task.status !== "VENCIDA") {
          await prisma.task.update({
            where: { id: task.id },
            data: { status: "VENCIDA" }
          });
          updatedCount++;
        }
      }
      return res.json({ message: `Tarefas vencidas atualizadas: ${updatedCount}` });
    } catch (error) {
      console.error('Erro ao atualizar tarefas vencidas:', error);
      return res.status(500).json({ error: "Erro ao atualizar tarefas vencidas." });
    }
  },

  async store(req: Request, res: Response) {
    try {
      const validatedData = taskSchema.parse(req.body);

      const task = await prisma.task.create({
        data: {
          title: validatedData.title,
          responsible: validatedData.responsible,
          dueDate: parseLocalDate(validatedData.dueDate),
          projectId: validatedData.projectId,
          status: "PENDENTE"
        }
      });
      return res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.flatten().fieldErrors });
      }
      return res.status(400).json({ error: "Erro ao criar tarefa." });
    }
  },

  
  async updateStatus(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const { status } = z.object({ 
        status: z.enum(["PENDENTE", "CONCLUIDA", "VENCIDA"]) 
      }).parse(req.body);

      const task = await prisma.task.update({
        where: { id },
        data: { status }
      });
      return res.json(task);
    } catch (error) {
      return res.status(400).json({ error: "Status ou ID inválido." });
    }
  },

  
  async update(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      const validatedData = updateTaskSchema.parse(req.body);

      const data: any = {};
      if (validatedData.title !== undefined) data.title = validatedData.title;
      if (validatedData.responsible !== undefined) data.responsible = validatedData.responsible;
      if (validatedData.dueDate) data.dueDate = parseLocalDate(validatedData.dueDate);
      if (validatedData.status !== undefined) data.status = validatedData.status;

      const task = await prisma.task.update({
        where: { id },
        data
      });
      return res.json(task);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return res.status(400).json({ error: "Dados inválidos para edição da tarefa." });
    }
  },

  
  async complete(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      
      const { status } = z.object({ 
        status: z.enum(["PENDENTE", "CONCLUIDA", "VENCIDA"]).optional() 
      }).parse(req.body);

      const task = await prisma.task.update({
        where: { id },
        data: { status: status || "CONCLUIDA" }
      });
      return res.json(task);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao processar conclusão da tarefa." });
    }
  },

  // Exclusão de tarefa
  async destroy(req: Request, res: Response) {
    try {
      const id = z.string().parse(req.params.id);
      
      console.log('Iniciando exclusão segura da tarefa:', id);
      
      await prisma.task.delete({ 
        where: { id } 
      });
      
      return res.status(200).json({ message: 'Tarefa excluída com sucesso.', id });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      return res.status(400).json({ error: "Erro ao excluir tarefa ou ID inexistente." });
    }
  }
};