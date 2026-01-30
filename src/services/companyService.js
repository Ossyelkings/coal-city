import api from './api';

const companyService = {
  get: () => api.get('/company'),
  update: (data) => api.put('/company', data),
};

export default companyService;
