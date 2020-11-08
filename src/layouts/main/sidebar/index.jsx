import React from 'react';
import { Skeleton, Tooltip, Typography } from 'antd';
import shortid from 'shortid';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@providers/user';
import theme from '@config/theme';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { Container, Sider, Avatar, SubtitleContainer } from './elements';

const { Paragraph } = Typography;

const Sidebar = () => {
  const { user, loadingUser, overallRole } = useUser();
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
        <SubtitleContainer style={{ marginTop: 20, marginBottom: 10 }}>
          <Paragraph style={{ color: 'white', margin: 0, fontSize: 10 }}>Home</Paragraph>
        </SubtitleContainer>
        <Tooltip placement="right" title="Home">
          <Container active={pathname === '/all' || pathname === '/' || pathname === '/users'}>
            <Link to="/">
              <Avatar
                style={{ background: theme.colors.primaryPalette[4] }}
                size={50}
                icon={<HomeOutlined style={{ color: theme.colors.background.dark }} />}
              />
            </Link>
          </Container>
        </Tooltip>
        {overallRole.admin && (
          <Tooltip placement="right" title="Crear desarrollo">
            <Container active={pathname === '/new'}>
              <Link to="/new">
                <Avatar
                  style={{ background: theme.colors.primaryPalette[4] }}
                  size={50}
                  icon={<PlusOutlined style={{ color: theme.colors.background.dark }} />}
                />
              </Link>
            </Container>
          </Tooltip>
        )}
        <SubtitleContainer style={{ marginTop: 20, marginBottom: 10 }}>
          <Paragraph style={{ color: 'white', margin: 0, fontSize: 10 }}>Activos</Paragraph>
        </SubtitleContainer>
        {user.worksAt.map(
          ({ development }) =>
            development.active && (
              <Tooltip key={development.id} placement="right" title={development.name}>
                <Container active={pathname.includes(development.id) ? 'true' : undefined}>
                  <Link to={`/development/${development.id}`}>
                    <Avatar size={50} src={development.logo} />
                  </Link>
                </Container>
              </Tooltip>
            )
        )}
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
