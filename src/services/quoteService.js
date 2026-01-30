import api from './api';

const quoteService = {
  submit: (data) => api.post('/quotes', data),
  list: (params) => api.get('/quotes', { params }),
  getById: (id) => api.get(`/quotes/${id}`),
  updateStatus: (id, data) => api.put(`/quotes/${id}/status`, data),
  myQuotes: () => api.get('/quotes/my'),
};

export default quoteService;
