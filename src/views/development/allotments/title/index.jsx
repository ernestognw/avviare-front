import PropTypes from 'prop-types';
import { Button, Input, Typography } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useDevelopment } from '@providers/development';
import TitleContainer from './elements';

const { Title } = Typography;
const { Search } = Input;

const TableTitle = ({ setSearch, openCreateAllotmentModal }) => {
  const { development, developmentRole } = useDevelopment();
  return (
    <TitleContainer>
      <Title style={{ margin: 'auto 10px' }} level={3}>
        Lotes de {development.name}
      </Title>
      <Search
        style={{ width: 250, margin: 'auto 10px auto auto' }}
        allowClear
        placeholder="Buscar lotes"
        onChange={({ target: { value } }) => setSearch(value)}
      />
      <Button
        style={{ margin: 'auto 10px' }}
        type="primary"
        onClick={openCreateAllotmentModal}
        disabled={!developmentRole.manager}
        icon={<UserAddOutlined />}
      >
        Añadir
      </Button>
    </TitleContainer>
  );
};

TableTitle.propTypes = {
  setSearch: PropTypes.func.isRequired,
  openCreateAllotmentModal: PropTypes.func.isRequired,
};

export default TableTitle;
