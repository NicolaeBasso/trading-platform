import axios from './axios';

const getUser = async () => {
  const res = await axios.get('users/me');

  console.log('getUser', res);

  return res.data;
};

export const UsersAPI = {
  getUser,
};
