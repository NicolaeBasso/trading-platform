import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_HOST,
  withCredentials: true,
  headers: {
    'X-DeviceType': 'Overmind-Trading-Dashboard',
    'X-OperatingSystem': 'None',
    'X-Language': 'EN',
  },
});

export default instance;
