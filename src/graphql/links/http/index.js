import { createUploadLink } from 'apollo-upload-client';
import { apiUrl } from '@config/environment';

const httpLink = createUploadLink({
  uri: apiUrl,
  credentials: 'include',
});

export default httpLink;
