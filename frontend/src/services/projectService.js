import api from './api.js';

const projectService = {
  async listAll() {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar projetos:', error);
      throw error;
    }
  },

  async create(name) {
    try {
      const response = await api.post('/projects', { name });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  },

  async update(id, name) {
    try {
      const response = await api.put(`/projects/${id}`, { name });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      throw error;
    }
  }
};

export default projectService;