import api from './api';

export const exchangeService = {
  create(data: FormData) {
    // Axios will set the correct multipart/form-data headers when a FormData instance is passed.
    return api.post('/exchanges', data);
  },

  findOne(id: string) {
    return api.get(`/exchanges/${id}`);
  },

  search(params?: Record<string, any>) {
    return api.get('/exchanges', { params });
  },
};

export default exchangeService;
