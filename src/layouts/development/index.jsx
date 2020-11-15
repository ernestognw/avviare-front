import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useTitle } from '@providers/layout';
import shortid from 'shortid';
import { useDevelopment } from '@providers/development';
import Box from '@components/box';
import Loading from '@components/loading';
import { AppstoreOutlined, FolderOpenOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Layout, Skeleton } from 'antd';
import { Cover, SkeletonImage, Avatar } from './elements';

const { Sider, Content } = Layout;
const { Item } = Menu;

const DevelopmentLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [collapsed, toggleCollapsed] = useState(false);
  const { development, loadingDevelopment, developmentRole } = useDevelopment();

  useTitle(development.name);

  const commonPath = `/development/${development.id}`;

  const selectedKeys = [pathname];

  if (pathname.includes('settings')) selectedKeys.push(`${commonPath}/settings`);

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Sider
        theme="light"
        collapsed={collapsed}
        collapsible
        onCollapse={() => toggleCollapsed(!collapsed)}
      >
        {loadingDevelopment ? (
          <SkeletonImage active={loadingDevelopment} loading={loadingDevelopment} />
        ) : (
          <>
            <Cover src={development?.cover} />
            <Avatar size={60} src={development?.logo} />
          </>
        )}
        <Menu style={{ height: '100%' }} selectedKeys={selectedKeys}>
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
              {developmentRole.manager && (
                <Item key={`${commonPath}/settings`} icon={<SettingOutlined />}>
                  <Link to={`${commonPath}/settings`}>Configuración</Link>
                </Item>
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
