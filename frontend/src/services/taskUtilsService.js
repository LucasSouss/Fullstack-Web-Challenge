import api from './api';

//CHAMA SEMRPE QUE A PÁGINA É RECARREGADA
const taskUtilsService = {
  async updateOverdueTasks() {
    try {
      const response = await api.get('/tasks/update-overdue');
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar tarefas vencidas:', error);
      throw error;
    }
  }
};

export default taskUtilsService;
