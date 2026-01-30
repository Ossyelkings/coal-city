import api from './api';

const teamService = {
  list: () => api.get('/team'),
  create: (data) => api.post('/team', data),
  update: (id, data) => api.put(`/team/${id}`, data),
  remove: (id) => api.delete(`/team/${id}`),
};

export default teamService;
