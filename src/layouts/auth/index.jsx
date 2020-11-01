import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { AuthWrapper } from './elements';

const AuthLayout = ({ children }) => {
  return (
    <Layout>
      <AuthWrapper>{children}</AuthWrapper>
    </Layout>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
