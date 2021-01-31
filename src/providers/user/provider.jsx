import { createContext, useState, useEffect, useMemo } from 'react';
import jwt from 'jsonwebtoken';
import { useQuery, useApolloClient } from '@apollo/client';
import PropTypes from 'prop-types';
import { accessToken, client } from '@utils/auth';
import { useHistory } from 'react-router-dom';
import cookies from 'react-cookies';
import useInterval from '@hooks/use-interval';
import { GET_USER } from './requests';

const userContext = createContext({});

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(accessToken.get());
  const [isLogged, setIsLogged] = useState(!!cookies.load('session'));

  const { overallRole, username } = useMemo(() => (token ? jwt.decode(token) : {}), [token]);
  const { push } = useHistory();
  const apolloClient = useApolloClient();

  const logoutWindow = async () => {
    setToken();
    setIsLogged(false);
    await apolloClient.clearStore();
    push('/login');
    accessToken.set();
  };

  const logout = async () => {
    logoutWindow();
    await client.post('/logout');

    // Force logout on every tab
    localStorage.setItem('logout', Date.now());
  };

  const getAccessToken = async () => {
    try {
      if (isLogged) {
        const { data } = await client.get('/access');

        accessToken.set(data.accessToken);
        setToken(data.accessToken);
      }
    } catch (err) {
      logout();
    }
  };

  useInterval(
    getAccessToken,
    1000 * 60 * 10, // 10 Minutes (5 mins less than access expiration)
    {
      skip: !isLogged,
      leading: true,
    }
  );

  useEffect(() => {
    // Listen when other tab logs out so every single tab returns to login
    const logoutListener = async (event) => {
      if (event.key === 'logout') logoutWindow();
    };

    window.addEventListener('storage', logoutListener);

    return () => window.removeEventListener('storage', logoutListener);
  }, []);

  const { data, loading, refetch } = useQuery(GET_USER, { skip: !token });

  const reloadUser = async () => {
    await getAccessToken();
    await refetch();
  };

  return (
    <userContext.Provider
      value={{
        isLogged,
        setIsLogged,
        token,
        logout,
        user: data?.userByToken ? { ...data.userByToken } : { username },
        loadingUser: loading,
        reloadUser,
        overallRole: {
          admin: overallRole === 'ADMIN',
          user: overallRole === 'USER',
        },
      }}
    >
      {children}
    </userContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { userContext };
export default UserProvider;
