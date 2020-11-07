import React from 'react';
import { Skeleton, Tooltip, Typography } from 'antd';
import shortid from 'shortid';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useUser } from '@providers/user';
import { HomeOutlined } from '@ant-design/icons';
import { Container, Sider, Avatar, SubtitleContainer } from './elements';

const { Paragraph } = Typography;

const Sidebar = () => {
  const { user, loadingUser } = useUser();
  const { developmentId } = useParams();
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
          <SubtitleContainer style={{ marginTop: 20 }}>
            <Paragraph style={{ color: 'white', margin: 0, fontSize: 10 }}>Home</Paragraph>
          </SubtitleContainer>
          <Container active={!pathname.includes('development')}>
            <Link to="/">
              <Avatar size={50} icon={<HomeOutlined />} />
            </Link>
          </Container>
        </Tooltip>
        <SubtitleContainer>
          <Paragraph style={{ color: 'white', margin: 0, fontSize: 10 }}>Activos</Paragraph>
        </SubtitleContainer>
        {user.worksAt.map(
          ({ development }) =>
            development.active && (
              <Tooltip key={development.id} placement="right" title={development.name}>
                <Container active={developmentId === development.id ? 'true' : undefined}>
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
