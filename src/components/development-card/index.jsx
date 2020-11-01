import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Typography, Tag } from 'antd';
import { Avatar, Card } from './elements';

const { Meta } = Card;
const { Text, Title } = Typography;

const DevelopmentCard = ({ name, active, cover, logo, startDate }) => {
  return (
    <Card cover={<img alt={name} src={cover} />}>
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
    </Card>
  );
};

DevelopmentCard.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  cover: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  startDate: PropTypes.any.isRequired,
};

export default DevelopmentCard;
