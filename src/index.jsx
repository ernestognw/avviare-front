import ReactDOM from 'react-dom';
import 'antd/dist/antd.less';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from '@providers/user';
import { LayoutProvider } from '@providers/layout';
import theme from '@config/theme';
import client from '@graphql';
import App from './App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <UserProvider>
        <LayoutProvider>
          <Router basename="/">
            <App />
          </Router>
        </LayoutProvider>
      </UserProvider>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
