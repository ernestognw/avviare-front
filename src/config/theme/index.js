import * as colors from '@ant-design/colors';
import TopBarProgress from 'react-topbar-progress-indicator';
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

TopBarProgress.config({
  barColors: {
    0: theme.colors.primary,
    '1.0': theme.colors.primary,
  },
  shadowBlur: 2,
  barThickness: 2,
  shadowColor: theme.colors.secondary,
});

export default theme;
