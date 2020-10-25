import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import theme from '@config/theme';
import client from '@graphql';
import App from './App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <Router basename="/">
        <App />
      </Router>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
