import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import theme from '@config/theme';
import App from './App';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Router basename="/">
      <App />
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
);
