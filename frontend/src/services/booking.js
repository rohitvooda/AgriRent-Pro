import api from './api';

export const getBookings = async (status) => {
  const params = status ? { status } : {};
  const response = await api.get('/bookings', { params });
  return response.data;
};

export const getBookingDetails = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const requestBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.put(`/bookings/${id}/status`, { status });
  return response.data;
};
