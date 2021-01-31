import axios from 'axios';
import { authUrl } from '@config/environment';

let inMemoryToken;

const accessToken = {
  set: (newToken) => {
    inMemoryToken = newToken;
  },
  get: () => inMemoryToken,
};

const client = axios.create({
  baseURL: authUrl,
  withCredentials: true,
});

export { client, accessToken };
