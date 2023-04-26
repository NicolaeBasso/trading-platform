import axios from './axios';

const profile = async () => {
  const res = await axios.get('/ap/admins/me');

  return res.data;
};

export const AdminAPI = { profile };
