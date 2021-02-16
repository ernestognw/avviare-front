import PropTypes from 'prop-types';
import { Button, Input, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useDevelopment } from '@providers/development';
import TitleContainer from './elements';

const { Title } = Typography;
const { Search } = Input;

const TableTitle = ({ search, setSearch, openCreateAllotmentPrototypeModal }) => {
  const { development, developmentRole } = useDevelopment();
  return (
    <TitleContainer>
      <Title style={{ margin: 'auto 10px' }} level={3}>
        Prototipos de {development.name}
      </Title>
      <Search
        value={search}
        style={{ width: 250, margin: 'auto 10px auto auto' }}
        allowClear
        placeholder="Buscar prototipos"
        onChange={({ target: { value } }) => setSearch(value)}
      />
      <Button
        style={{ margin: 'auto 10px' }}
        type="primary"
        onClick={openCreateAllotmentPrototypeModal}
        disabled={!developmentRole.manager}
        icon={<UserAddOutlined />}
      >
        Añadir
      </Button>
    </TitleContainer>
  );
};

TableTitle.defaultProps = {
  search: '',
};

TableTitle.propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  openCreateAllotmentPrototypeModal: PropTypes.func.isRequired,
};

export default TableTitle;
