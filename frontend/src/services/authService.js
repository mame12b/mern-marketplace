import api from '../utils/axios';

// const API_URL = 'http://localhost:5000/api/auth/';

export const registerUser = async (userData) => {
  const response = await api.post ("/api/auth/register", userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};
export const loginUser = async (userData) => {
  const response = await api.post("/api/auth/login", userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');

};

export const getMe = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};