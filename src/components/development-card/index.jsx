import PropTypes from 'prop-types';
import moment from 'moment';
import theme from '@config/theme';
import { Link } from 'react-router-dom';
import { Typography, Tag, Tooltip } from 'antd';
import { Avatar, Card, Image } from './elements';

const { Meta } = Card;
const { Text, Title } = Typography;

const DevelopmentCard = ({ id, name, active, cover, logo, startDate, workers }) => {
  return (
    <Link to={`/development/${id}`}>
      <Card cover={<Image src={cover} />}>
        <Meta
          avatar={<Avatar size={60} src={logo} />}
          title={
            <>
              <Title style={{ margin: 0 }} level={5}>
                {name}
              </Title>
              <Tag color={active ? 'success' : 'error'}>{active ? 'Activo' : 'Inactivo'}</Tag>
            </>
          }
          description={
            <>
              <Text style={{ fontSize: 10 }} type="secondary" strong>
                Inicio:{' '}
              </Text>
              <Text style={{ fontSize: 10 }} type="secondary">
                {moment(startDate).format('ll')}
              </Text>
            </>
          }
        />
        {workers?.results.length > 0 && (
          <Avatar.Group
            style={{ marginTop: 20 }}
            maxCount={5}
            maxStyle={{ backgroundColor: theme.colors.primary }}
          >
            {workers?.results.map(({ id: workerId, firstName, lastName, profileImg }) => (
              <Tooltip key={workerId} title={`${firstName} ${lastName}`} placement="top">
                <Avatar src={profileImg}>{firstName[0]}</Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        )}
      </Card>
    </Link>
  );
};

DevelopmentCard.defaultProps = {
  workers: [],
};

DevelopmentCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  cover: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  startDate: PropTypes.any.isRequired,
  workers: PropTypes.shape({
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        profileImg: PropTypes.string,
      })
    ),
  }),
};

export default DevelopmentCard;
