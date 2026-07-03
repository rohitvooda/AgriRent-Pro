import api from './api';

export const makePayment = async (paymentData) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

export const getBookingPayments = async (bookingId) => {
  const response = await api.get(`/payments/booking/${bookingId}`);
  return response.data;
};

// Add reviews here for convenience
export const submitReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const getEquipmentReviews = async (equipmentId) => {
  const response = await api.get(`/reviews/equipment/${equipmentId}`);
  return response.data;
};
