import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import TitleContainer from './elements';

const { Title } = Typography;
const { Search } = Input;

const TableTitle = ({ setSearch }) => {
  return (
    <TitleContainer>
      <Title style={{ margin: 'auto 10px' }} level={3}>
        Usuarios de la plataforma
      </Title>
      <Search
        style={{ width: 250, margin: 'auto 10px auto auto' }}
        allowClear
        placeholder="Buscar usuarios"
        onChange={({ target: { value } }) => setSearch(value)}
      />
      <Button
        style={{ margin: 'auto 10px' }}
        type="primary"
        icon={<UserAddOutlined />}
        onClick={() => {}}
      >
        Añadir
      </Button>
    </TitleContainer>
  );
};

TableTitle.propTypes = {
  setSearch: PropTypes.func.isRequired,
};

export default TableTitle;
