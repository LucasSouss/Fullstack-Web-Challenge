import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';

export const ProjectController = {
  async index(req: Request, res: Response) {
    try {
      const projects = await ProjectService.listAll();
      return res.json(projects);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar projetos." });
    }
  },

  async store(req: Request, res: Response) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: "Nome é obrigatório." });
      
      const project = await ProjectService.create(name);
      return res.status(201).json(project);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao criar projeto." });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { name } = req.body;
      const project = await ProjectService.update(id, name);
      return res.json(project);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar projeto." });
    }
  },

  async destroy(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await ProjectService.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: "Erro ao excluir projeto ou projeto inexistente." });
    }
  }
};