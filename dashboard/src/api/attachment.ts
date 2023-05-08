import axios from './axios';

const post = async (body: any) => {
  const res = await axios.post('/ap/files/uploadPublic', body);

  return res.data;
};

export const AttachmentAPI = {
  post,
};
