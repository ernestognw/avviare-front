import React from 'react';
import PropTypes from 'prop-types';
import { useProfile } from '@providers/profile';
import { useTitle } from '@providers/layout';
import moment from 'moment';
import { Link, useLocation, useParams } from 'react-router-dom';
import { overallRoles } from '@config/constants/user';
import { BlockOutlined } from '@ant-design/icons';
import { PageHeader, Tabs, Tag, Typography, Skeleton } from 'antd';
import Box from '@components/box';
import Loading from '@components/loading';

const { TabPane } = Tabs;
const { Paragraph, Title } = Typography;

const ProfileLayout = ({ children }) => {
  const { isOwner, profile, loadingProfile } = useProfile();
  const { pathname } = useLocation();
  const { username } = useParams();

  useTitle(loadingProfile ? '' : isOwner ? 'Mi perfil' : `Perfil de ${profile.firstName}`);

  return (
    <>
      <PageHeader
        ghost={false}
        style={{ marginTop: 1 }}
        title={
          <div>
            {loadingProfile ? (
              <Skeleton
                avatar={{ size: 65 }}
                paragraph={{ rows: 1, style: { width: 400 } }}
                title={{ style: { width: 200 } }}
                active
              />
            ) : (
              <>
                <Title style={{ margin: 0 }} level={3}>
                  {profile.firstName} {profile.lastName}
                </Title>
                <Paragraph style={{ fontSize: 14, fontWeight: 500, margin: 0 }} type="secondary">
                  @{profile.username}
                </Paragraph>
              </>
            )}
          </div>
        }
        avatar={
          !loadingProfile && {
            src: profile.profileImg,
            size: 65,
            children: profile.firstName?.[0],
            style: { marginRight: 20 },
          }
        }
        extra={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {loadingProfile ? (
              <Skeleton.Button size="small" active />
            ) : (
              <>
                <Tag color="blue">{overallRoles[profile.overallRole]}</Tag>
                <Tag color="green">{profile.email}</Tag>
                <Tag color="green">{moment(profile.dateOfBirth).format('ll')}</Tag>
              </>
            )}
          </div>
        }
        footer={
          <Tabs>
            <TabPane
              activeKey={pathname}
              key={`/@${username}`}
              tab={
                <Link to={`/@${username}`}>
                  <BlockOutlined />
                  Desarrollos
                </Link>
              }
            />
          </Tabs>
        }
      />
      {loadingProfile ? (
        <Box display="flex" m={40} justifyContent="center" width="100%">
          <Loading />
        </Box>
      ) : (
        children
      )}
    </>
  );
};

ProfileLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProfileLayout;
