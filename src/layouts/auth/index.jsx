import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { AuthWrapper } from './elements';

const AuthLayout = ({ children }) => {
  return (
    <Layout>
      <AuthWrapper>
        <div style={{ maxWidth: 400, width: '100%', padding: 20, height: 'auto' }}>
          <img
            style={{ margin: '10px auto', display: 'block', marginBottom: 30 }}
            width={200}
            src="/images/brand/logo_black.png"
            alt="Logo"
          />
          {children}
        </div>
      </AuthWrapper>
    </Layout>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
