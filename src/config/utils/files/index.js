import { list } from '@config/utils';
import { message } from 'antd';

const validateImageTypes = async (file, types = ['png', 'jpeg'], mbLimit = 2) => {
  const isValidType = types.some((type) => `image/${type}` === file.type);

  if (!isValidType) message.error(`Sólo está permitido subir imágenes en formato: ${list(types)}`);

  const isLessThanMbLimit = file.size / 1024 / 1024 < mbLimit;

  if (!isLessThanMbLimit) message.error(`La imagen debe medir menos de ${mbLimit} mb`);

  return isValidType && isLessThanMbLimit;
};

export { validateImageTypes };