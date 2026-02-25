import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { TaskController } from '../controllers/TaskController';

const router = Router();

// Projects
router.get('/projects', ProjectController.index);
router.post('/projects', ProjectController.store);
router.put('/projects/:id', ProjectController.update);
router.delete('/projects/:id', ProjectController.destroy);

// Tasks
router.post('/tasks', TaskController.store);
router.put('/tasks/:id', TaskController.update);
router.delete('/tasks/:id', TaskController.destroy);
router.patch('/tasks/:id/complete', TaskController.complete);
router.put('/tasks/:id', TaskController.update);
router.patch('/tasks/:id/status', TaskController.updateStatus);
router.get('/tasks/update-overdue', TaskController.updateOverdueTasks);

export { router };