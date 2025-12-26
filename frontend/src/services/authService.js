import api from '../utils/axios';

const persistSession = (user, token) => {
  if (user && token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
};



const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const registerUser = async (userData) => {
  const res = await api.post("/api/auth/register", userData);
  

  const { user, token, message } = res.data;
  persistSession(user, token);
  return { user, token, message };
};

export const loginUser = async (userData) => {
  const res = await api.post("/api/auth/login", userData);

  const { user, token, message } = res.data;

  persistSession(user, token);

  return { user, token, message };
};

export const logoutUser = async () => {
  try {
    await api.get("/api/auth/logout");
  } catch (error) {
    // even if the API call fails, ensure local session is cleared
    console.error("Logout request failed", error);
  } finally {
   clearSession();
  }
};

export const getMe = async () => {
  const res = await api.get("/api/auth/me");
  return res.data.user;
};
