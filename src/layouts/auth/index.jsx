import PropTypes from 'prop-types';
import { Layout } from 'antd';
import Box from '@components/box';
import { AuthWrapper } from './elements';

const AuthLayout = ({ children }) => {
  return (
    <Layout>
      <AuthWrapper>
        <div style={{ maxWidth: 400, width: '100%', padding: 20, height: 'auto' }}>
          <Box
            as="img"
            mb={30}
            mx="auto"
            mt={10}
            display="block"
            width={200}
            src="/images/brand/logo-primary.svg"
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
