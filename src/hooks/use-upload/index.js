import client from '@graphql';
import { useGraphqlUpload } from 'use-upload';
import { GET_SIGNED_URL } from './requests';

const useUpload = () => {
  const { upload: originalUpload, ...rest } = useGraphqlUpload(GET_SIGNED_URL, {
    apolloClient: client,
  });

  const upload = (file, filePath) =>
    originalUpload(file, { variables: { filePath, fileType: file.type } });

  return { upload, ...rest };
};

export default useUpload;
