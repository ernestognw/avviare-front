import * as colors from '@ant-design/colors';
import media from './media';
import variables from './variables.json';

const theme = {
  media,
  ...variables,
  colors: {
    ...variables.colors,
    ...colors,
  },
};

export default theme;
