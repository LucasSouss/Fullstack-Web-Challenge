import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
});

api.interceptors.response.use(
  response => {
    console.log('Resposta da API:', response.data);
    return response;
  },
  error => {
    console.error('Erro na API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;