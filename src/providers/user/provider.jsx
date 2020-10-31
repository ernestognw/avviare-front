import React from 'react';
import jwt from 'jsonwebtoken';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import { GET_USER } from './requests';

export const userContext = React.createContext({});

const UserProvider = ({ children }) => {
  const token = cookie.load('token');
  const tokenPayload = token ? jwt.decode(token) : {};

  const { data, loading } = useQuery(GET_USER);

  return (
    <userContext.Provider
      value={{
        user: data?.userByToken ?? {},
        loadingUser: loading,
        token,
        overall: {
          admin: tokenPayload.overallRole === 'ADMIN',
          user: tokenPayload.overallRole === 'USER',
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

export default UserProvider;
