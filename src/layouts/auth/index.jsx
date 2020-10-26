import React from 'react';
import PropTypes from 'prop-types';
import { AuthWrapper } from './elements';

const AuthLayout = ({ children }) => {
  return <AuthWrapper>{children}</AuthWrapper>;
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
