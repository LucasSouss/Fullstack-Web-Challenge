import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';
import { z } from 'zod';


const projectSchema = z.object({
  name: z.string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres")
    .transform(val => val.trim()) 
});


const idParamSchema = z.string().min(1, "ID do projeto é obrigatório");


export const ProjectController = {
  
  // Lista todos os projetos
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
    
      const { name } = projectSchema.parse(req.body); 
      
      const project = await ProjectService.create(name);
      return res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues[0].message });
      }
      return res.status(400).json({ error: "Erro ao criar projeto." });
    }
  },

  
  async update(req: Request, res: Response) {
    try {
      const id = idParamSchema.parse(req.params.id);
      const { name } = projectSchema.parse(req.body);

      const project = await ProjectService.update(id, name);
      return res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues[0].message });
      }
      return res.status(400).json({ error: "Dados inválidos para atualização." });
    }
  },


  async destroy(req: Request, res: Response) {
    try {
      const id = idParamSchema.parse(req.params.id);
      
      await ProjectService.delete(id);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "ID de projeto inválido." });
      }
      return res.status(400).json({ error: "Erro ao excluir projeto ou projeto inexistente." });
    }
  }
};