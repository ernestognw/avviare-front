import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useLayout, useTitle } from '@providers/layout';
import shortid from 'shortid';
import { useDevelopment } from '@providers/development';
import Box from '@components/box';
import Loading from '@components/loading';
import {
  AppstoreOutlined,
  FolderOpenOutlined,
  SettingOutlined,
  BuildOutlined,
  LayoutOutlined,
  UserOutlined,
  EditOutlined,
  AuditOutlined,
  RiseOutlined,
  GroupOutlined,
} from '@ant-design/icons';
import { Menu, Layout, Skeleton } from 'antd';
import { Cover, SkeletonImage, Avatar } from './elements';

const { Sider, Content } = Layout;
const { Item, SubMenu } = Menu;

const DevelopmentLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { developmentSidebarOpen, toggleDevelopmentSidebar } = useLayout();
  const { development, loadingDevelopment, developmentRole, userHasAccess } = useDevelopment();
  const { push } = useHistory();

  useEffect(() => {
    if (!userHasAccess) push('/');
  }, [userHasAccess]);

  useTitle(development.name);

  const commonPath = `/development/${development.id}`;

  const selectedKeys = [pathname];

  if (pathname.includes('documents')) selectedKeys.push(`${commonPath}/documents`);
  if (pathname.includes('allotments')) selectedKeys.push(`${commonPath}/allotments`);
  if (pathname.includes('prototypes')) selectedKeys.push(`${commonPath}/prototypes`);
  if (pathname.includes('advancements')) selectedKeys.push(`${commonPath}/advancements`);

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Sider
        theme="light"
        collapsed={developmentSidebarOpen}
        collapsible
        onCollapse={() => toggleDevelopmentSidebar(!developmentSidebarOpen)}
      >
        {loadingDevelopment ? (
          <SkeletonImage active={loadingDevelopment} loading={loadingDevelopment} />
        ) : (
          <>
            <Cover src={development?.cover} />
            <Avatar size={60} src={development?.logo} />
          </>
        )}
        <Menu style={{ height: '100%' }} mode="inline" selectedKeys={selectedKeys}>
          {loadingDevelopment ? (
            new Array(5).fill().map(() => (
              <Item key={shortid.generate()}>
                <Skeleton title={{ width: '100%' }} active />
              </Item>
            ))
          ) : (
            <>
              <Item key={commonPath} icon={<AppstoreOutlined />}>
                <Link to={commonPath}>Dashboard</Link>
              </Item>
              <Item key={`${commonPath}/documents`} icon={<FolderOpenOutlined />}>
                <Link to={`${commonPath}/documents`}>Documentos</Link>
              </Item>
              <Item key={`${commonPath}/prototypes`} icon={<BuildOutlined />}>
                <Link to={`${commonPath}/prototypes`}>Prototipos</Link>
              </Item>
              <Item key={`${commonPath}/allotments`} icon={<LayoutOutlined />}>
                <Link to={`${commonPath}/allotments`}>Lotes</Link>
              </Item>
              <Item key={`${commonPath}/advancements`} icon={<RiseOutlined />}>
                <Link to={`${commonPath}/advancements`}>Avances</Link>
              </Item>
              <Item key={`${commonPath}/workloads`} icon={<GroupOutlined />}>
                <Link to={`${commonPath}/workloads`}>Cargas de trabajo</Link>
              </Item>
              {developmentRole.manager && (
                <SubMenu
                  title="Configuración"
                  key={`${commonPath}/settings`}
                  icon={<SettingOutlined />}
                >
                  <Item key={`${commonPath}/settings`} icon={<EditOutlined />}>
                    <Link to={`${commonPath}/settings`}>General</Link>
                  </Item>
                  <Item key={`${commonPath}/settings/members`} icon={<UserOutlined />}>
                    <Link to={`${commonPath}/settings/members`}>Miembros</Link>
                  </Item>
                  <Item key={`${commonPath}/settings/providers`} icon={<AuditOutlined />}>
                    <Link to={`${commonPath}/settings/providers`}>Proveedores</Link>
                  </Item>
                </SubMenu>
              )}
            </>
          )}
        </Menu>
      </Sider>
      {loadingDevelopment ? (
        <Box display="flex" m={40} justifyContent="center" width="100%">
          <Loading />
        </Box>
      ) : (
        <Content>{children}</Content>
      )}
    </Layout>
  );
};

DevelopmentLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DevelopmentLayout;
