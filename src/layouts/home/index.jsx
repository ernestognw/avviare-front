import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@providers/user';
import {
  BlockOutlined,
  AppstoreOutlined,
  UserOutlined,
  AuditOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';

const { Item } = Menu;

const HomeLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { overallRole } = useUser();

  const selectedKeys = [pathname];

  if (pathname.includes('credits')) selectedKeys.push('/credits');

  return (
    <>
      <Menu mode="horizontal" selectedKeys={selectedKeys}>
        {overallRole?.admin && (
          <Item key="/all" icon={<AppstoreOutlined />}>
            <Link to="/all">Todos los desarrollos</Link>
          </Item>
        )}
        <Item key="/" icon={<BlockOutlined />}>
          <Link to="/">Mis desarrollos</Link>
        </Item>
        {overallRole?.admin && (
          <Item key="/users" icon={<UserOutlined />}>
            <Link to="/users">Usuarios</Link>
          </Item>
        )}
        {overallRole?.admin && (
          <Item key="/providers" icon={<AuditOutlined />}>
            <Link to="/providers">Proveedores</Link>
          </Item>
        )}
        {overallRole?.admin && (
          <Item key="/credits" icon={<PercentageOutlined />}>
            <Link to="/credits">Créditos</Link>
          </Item>
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
