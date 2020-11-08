import { generate } from '@ant-design/colors';
import TopBarProgress from 'react-topbar-progress-indicator';
import media from './media';
import variables from './variables.json';

const theme = {
  media,
  ...variables,
  colors: {
    ...Object.keys(variables.colors).reduce((acc, color) => {
      acc[color] = variables.colors[color];
      acc[`${color}Palette`] = generate(variables.colors[color]);
      return acc;
    }, {}),
    background: {
      dark: '#001529',
      light: '#fff',
      grey: '#f0f2f5',
    },
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
