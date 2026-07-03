import api from './api';

export const getAllEquipment = async (filters = {}) => {
  const response = await api.get('/equipment', { params: filters });
  return response.data;
};

export const getEquipmentDetails = async (id) => {
  const response = await api.get(`/equipment/${id}`);
  return response.data;
};

export const createEquipment = async (equipmentData) => {
  const response = await api.post('/equipment', equipmentData);
  return response.data;
};

export const updateEquipment = async (id, equipmentData) => {
  const response = await api.put(`/equipment/${id}`, equipmentData);
  return response.data;
};

export const deleteEquipment = async (id) => {
  const response = await api.delete(`/equipment/${id}`);
  return response.data;
};

export const uploadEquipmentImage = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/equipment/${id}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
