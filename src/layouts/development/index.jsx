import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useTitle } from '@providers/layout';
import shortid from 'shortid';
import { useDevelopment } from '@providers/development';
import {
  AppstoreOutlined,
  FolderOpenOutlined,
  LoadingOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu, Layout, Spin, Skeleton } from 'antd';
import { Cover, SkeletonImage, Avatar } from './elements';

const { Sider, Content } = Layout;
const { Item } = Menu;

const DevelopmentLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [collapsed, toggleCollapsed] = useState(false);
  const { development, loadingDevelopment } = useDevelopment();

  useTitle(development.name);

  const commonPath = `/development/${development.id}`;

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
        <Menu style={{ height: '100%' }} selectedKeys={[pathname]}>
          {loadingDevelopment ? (
            new Array(5).fill().map(() => (
              <Item key={shortid.generate()}>
                <Skeleton title={{ width: '100%' }} active />
              </Item>
            ))
          ) : (
            <>
              <Menu.Item key={commonPath} icon={<AppstoreOutlined />}>
                <Link to={commonPath}>Dashboard</Link>
              </Menu.Item>
              <Menu.Item key={`${commonPath}/documents`} icon={<FolderOpenOutlined />}>
                <Link to={`${commonPath}/documents`}>Documentos</Link>
              </Menu.Item>
              <Menu.Item key={`${commonPath}/settings`} icon={<SettingOutlined />}>
                <Link to={`${commonPath}/settings`}>Configuración</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Sider>
      {loadingDevelopment ? (
        <div
          style={{
            display: 'flex',
            margin: 40,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
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
