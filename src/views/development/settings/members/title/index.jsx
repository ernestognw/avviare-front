import PropTypes from 'prop-types';
import { Button, Input, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useDevelopment } from '@providers/development';
import TitleContainer from './elements';

const { Title } = Typography;
const { Search } = Input;

const TableTitle = ({ setSearch, openCreateUserModal }) => {
  const { development, developmentRole } = useDevelopment();
  return (
    <TitleContainer>
      <Title style={{ margin: 'auto 10px' }} level={3}>
        Miembros de {development.name}
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
        disabled={!developmentRole.manager}
        icon={<UserAddOutlined />}
        onClick={openCreateUserModal}
      >
        Añadir
      </Button>
    </TitleContainer>
  );
};

TableTitle.propTypes = {
  setSearch: PropTypes.func.isRequired,
  openCreateUserModal: PropTypes.func.isRequired,
};

export default TableTitle;
