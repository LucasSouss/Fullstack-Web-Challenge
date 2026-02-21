import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { TaskController } from '../controllers/TaskController';

const router = Router();

// Projetos
router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.put('/projects/:id', ProjectController.update);
router.delete('/projects/:id', ProjectController.destroy);

// Tarefas
router.post('/tasks', TaskController.store);
router.delete('/tasks/:id', TaskController.destroy);
router.patch('/tasks/:id/complete', TaskController.complete);

export { router };