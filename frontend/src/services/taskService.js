import api from './api.js';

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

  async update(id, taskData) {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  },

  async complete(id) {
    try {
      const response = await api.patch(`/tasks/${id}/complete`, { status: "CONCLUIDA" });
  return response.data;
    } catch (error) {
      console.error('Erro ao completar tarefa:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      console.log('Deletando tarefa com ID:', id);
      const response = await api.delete(`/tasks/${id}`);
      console.log('Resposta ao deletar:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default taskService;