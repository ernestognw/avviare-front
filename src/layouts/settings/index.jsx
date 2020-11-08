import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useTitle } from '@providers/layout';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Card } from './elements';

const { Content, Sider } = Layout;
const { Item } = Menu;

const SettingsLayout = ({ children }) => {
  useTitle('Settings');

  const { pathname } = useLocation();

  return (
    <Layout style={{ padding: 24 }}>
      <Card>
        <Sider>
          <Menu mode="inline" selectedKeys={[pathname]} style={{ height: '100%' }}>
            <Item icon={<UserOutlined />} key="/settings">
              <Link to="/settings">Perfil</Link>
            </Item>
            <Item icon={<LockOutlined />} key="/settings/security">
              <Link to="/settings/security">Seguridad</Link>
            </Item>
          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', width: '100%' }}>{children}</Content>
      </Card>
    </Layout>
  );
};

SettingsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SettingsLayout;
