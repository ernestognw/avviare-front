import PropTypes from 'prop-types';
import { Button, Input, Typography } from 'antd';
import { useDevelopment } from '@providers/development';
import { UserAddOutlined } from '@ant-design/icons';
import TitleContainer from './elements';

const { Title } = Typography;
const { Search } = Input;

const TableTitle = ({ setSearch, openAddProviderModal }) => {
  const { development, developmentRole } = useDevelopment();
  return (
    <TitleContainer>
      <Title style={{ margin: 'auto 10px' }} level={3}>
        Proveedores de {development.name}
      </Title>
      <Search
        style={{ width: 250, margin: 'auto 10px auto auto' }}
        allowClear
        placeholder="Buscar proveedores"
        onChange={({ target: { value } }) => setSearch(value)}
      />
      <Button
        onClick={openAddProviderModal}
        style={{ margin: 'auto 10px' }}
        type="primary"
        disabled={!developmentRole.manager}
        icon={<UserAddOutlined />}
      >
        Añadir
      </Button>
    </TitleContainer>
  );
};

TableTitle.propTypes = {
  openAddProviderModal: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
};

export default TableTitle;
