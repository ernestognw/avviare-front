import PropTypes from 'prop-types';
import { Button, Input, Typography, Select } from 'antd';
import { documentCategories } from '@config/constants/document';
import { FileAddOutlined } from '@ant-design/icons';
import Box from '@components/box';
import { useDevelopment } from '@providers/development';
import { TitleContainer } from './elements';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const TableTitle = ({ setCategories, setSearch, openCreateDocumentModal }) => {
  const { development, developmentRole } = useDevelopment();

  return (
    <TitleContainer>
      <Box display="flex">
        <Title style={{ margin: 'auto 10px' }} level={3}>
          Documentos de {development.name}
        </Title>

        <Button
          style={{ margin: '10px 0 auto auto' }}
          type="primary"
          disabled={!developmentRole.manager}
          icon={<FileAddOutlined />}
          onClick={openCreateDocumentModal}
        >
          Añadir
        </Button>
      </Box>
      <Box display="flex" mt={10}>
        <Select
          style={{ width: 250, margin: 'auto 10px auto auto' }}
          mode="multiple"
          allowClear
          placeholder="Filtrar por categorías"
          onChange={setCategories}
        >
          {Object.keys(documentCategories).map((category) => (
            <Option key={category} value={category}>
              {documentCategories[category]}
            </Option>
          ))}
        </Select>
        <Search
          style={{ width: 250, margin: 'auto 0 auto 10px' }}
          allowClear
          placeholder="Buscar documentos"
          onChange={({ target: { value } }) => setSearch(value)}
        />
      </Box>
    </TitleContainer>
  );
};

TableTitle.propTypes = {
  setCategories: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  openCreateDocumentModal: PropTypes.func.isRequired,
};

export default TableTitle;
