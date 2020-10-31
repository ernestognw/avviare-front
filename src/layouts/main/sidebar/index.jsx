import React from 'react';
import { Skeleton, Tooltip } from 'antd';
import shortid from 'shortid';
import { Link, useRouteMatch, useLocation } from 'react-router-dom';
import { useUser } from '@providers/user';
import { HomeOutlined } from '@ant-design/icons';
import { Container, Sider, Avatar } from './elements';

const Sidebar = () => {
  const { user, loadingUser } = useUser();
  const match = useRouteMatch('/development/:developmentId');
  const { pathname } = useLocation();

  let content;

  if (loadingUser) {
    content = new Array(5).fill().map(() => (
      <Container key={shortid.generate()}>
        <Skeleton.Avatar size={50} active style={{ opacity: 0.3 }} />
      </Container>
    ));
  } else {
    content = (
      <>
        <Tooltip placement="right" title="Home">
          <Container active={pathname === '/'}>
            <Link to="/">
              <Avatar size={50} icon={<HomeOutlined />} />
            </Link>
          </Container>
        </Tooltip>
        {user.worksAt.map(({ development }) => (
          <Tooltip key={development.id} placement="right" title={development.name}>
            <Container
              active={match?.params?.developmentId === development.id ? 'true' : undefined}
            >
              <Link to={`/development/${development.id}`}>
                <Avatar size={50} src={development.logo} />
              </Link>
            </Container>
          </Tooltip>
        ))}
      </>
    );
  }

  return (
    <Sider theme="dark" collapsed>
      {content}
    </Sider>
  );
};

export default Sidebar;
