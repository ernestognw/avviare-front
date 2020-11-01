import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@providers/user';
import { BlockOutlined, AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

const HomeLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { overall } = useUser();

  return (
    <>
      <Menu mode="horizontal" selectedKeys={[pathname]}>
        {overall?.admin && (
          <Menu.Item key="/all" icon={<AppstoreOutlined />}>
            <Link to="/all">Todos los desarrollos</Link>
          </Menu.Item>
        )}
        <Menu.Item key="/" icon={<BlockOutlined />}>
          <Link to="/">Mis desarrollos</Link>
        </Menu.Item>
        {overall?.admin && (
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <Link to="/users">Usuarios</Link>
          </Menu.Item>
        )}
      </Menu>
      {children}
    </>
  );
};

HomeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HomeLayout;