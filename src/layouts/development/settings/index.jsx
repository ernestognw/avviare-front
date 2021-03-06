import PropTypes from 'prop-types';
import { useLocation, useParams, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UserOutlined, EditOutlined, AuditOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Item } = Menu;

const DevelopmentSettingsLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { developmentId } = useParams();

  return (
    <Layout>
      <Menu mode="horizontal" selectedKeys={[pathname]} style={{ height: '100%' }}>
        <Item icon={<EditOutlined />} key={`/development/${developmentId}/settings`}>
          <Link to={`/development/${developmentId}/settings`}>General</Link>
        </Item>
        <Item icon={<UserOutlined />} key={`/development/${developmentId}/settings/members`}>
          <Link to={`/development/${developmentId}/settings/members`}>Miembros</Link>
        </Item>
        <Item icon={<AuditOutlined />} key={`/development/${developmentId}/settings/providers`}>
          <Link to={`/development/${developmentId}/settings/providers`}>Proveedores</Link>
        </Item>
      </Menu>
      <Content>{children}</Content>
    </Layout>
  );
};

DevelopmentSettingsLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DevelopmentSettingsLayout;
