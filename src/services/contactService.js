import api from './api';

const contactService = {
  submit: (data) => api.post('/contacts', data),
  list: (params) => api.get('/contacts', { params }),
  getById: (id) => api.get(`/contacts/${id}`),
  updateStatus: (id, data) => api.put(`/contacts/${id}/status`, data),
};

export default contactService;
