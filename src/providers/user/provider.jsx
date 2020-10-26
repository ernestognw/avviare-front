import React, { useState } from 'react';
import jwt from 'jsonwebtoken';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';

export const userContext = React.createContext({});

const UserProvider = ({ children }) => {
  const [user] = useState({});
  const token = cookie.load('token');
  const tokenPayload = token ? jwt.decode(token) : {};

  return (
    <userContext.Provider
      value={{
        user,
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
