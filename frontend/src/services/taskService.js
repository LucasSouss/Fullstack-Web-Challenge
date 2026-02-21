import api from './api';

const taskService = {
  async create(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  },

  async complete(id) {
    try {
      const response = await api.patch(`/tasks/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error('Erro ao completar tarefa:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    }
  }
};

export default taskService;