import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Typography, Select } from 'antd';
import { PlusOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@apollo/client';
import { useDevelopment } from '@providers/development';
import { searchableFields as allotmentPrototypeSearchableFields } from '@config/constants/allotment-prototype';
import { searchableFields as blockSearchableFields } from '@config/constants/block';
import Box from '@components/box';
import TitleContainer from './elements';
import { GET_BLOCKS, GET_ALLOTMENT_PROTOTYPES } from './requests';

const params = {
  page: 1,
  pageSize: 5,
};

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const TableTitle = ({
  setSearch,
  openCreateAllotmentModal,
  setBlocks,
  setAllotmentPrototypes,
  openBlocksModal,
}) => {
  const [blockSearch, setBlockSearch] = useState('');
  const [allotmentPrototypeSearch, setAllotmentPrototypeSearch] = useState('');

  const [debouncedBlockSearch] = useDebounce(blockSearch, 500);
  const [debouncedAllotmentPrototypeSearch] = useDebounce(allotmentPrototypeSearch, 500);

  const { development, developmentRole } = useDevelopment();

  const { data: blocksData, loading: loadingBlocks } = useQuery(GET_BLOCKS, {
    variables: {
      development: {
        eq: development.id,
      },
      params,
      search: blockSearchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedBlockSearch;
        return acc;
      }, {}),
    },
    skip: !development.id,
  });

  const { data: allotmentPrototypesData, loading: loadingAllotmentPrototypes } = useQuery(
    GET_ALLOTMENT_PROTOTYPES,
    {
      variables: {
        development: {
          eq: development.id,
        },
        params,
        search: allotmentPrototypeSearchableFields.reduce((acc, curr) => {
          acc[curr] = debouncedAllotmentPrototypeSearch;
          return acc;
        }, {}),
      },
      skip: !development.id,
    }
  );

  return (
    <TitleContainer>
      <Box display="flex">
        <Title style={{ margin: 'auto 10px' }} level={3}>
          Lotes de {development.name}
        </Title>
        <Search
          style={{ width: 200, margin: 'auto 10px auto auto' }}
          allowClear
          placeholder="Buscar lotes"
          onChange={({ target: { value } }) => setSearch(value)}
        />
        <Button
          style={{ margin: 'auto 10px auto 10px' }}
          type="primary"
          onClick={openCreateAllotmentModal}
          disabled={!developmentRole.manager}
          icon={<PlusOutlined />}
        >
          Añadir
        </Button>
      </Box>
      <Box mt={10} display="flex">
        <Select
          style={{ width: 200, margin: 'auto 10px auto auto' }}
          mode="multiple"
          allowClear
          loading={loadingAllotmentPrototypes}
          onSearch={setAllotmentPrototypeSearch}
          filterOption={false}
          showSearch
          placeholder="Filtrar por prototipo"
          onChange={setAllotmentPrototypes}
        >
          {allotmentPrototypesData?.allotmentPrototypes.results.map(({ id, name }) => (
            <Option key={id} value={id}>
              {name}
            </Option>
          ))}
        </Select>
        <Select
          style={{ width: 200, margin: 'auto 10px auto 10px' }}
          mode="multiple"
          allowClear
          loading={loadingBlocks}
          onSearch={setBlockSearch}
          filterOption={false}
          showSearch
          placeholder="Filtrar por manzanas"
          onChange={setBlocks}
        >
          {blocksData?.blocks.results.map(({ id, number }) => (
            <Option key={id} value={id}>
              {number}
            </Option>
          ))}
        </Select>
        <Button
          onClick={openBlocksModal}
          style={{ margin: 'auto 0 auto 10px' }}
          icon={<MenuFoldOutlined />}
        >
          Manzanas
        </Button>
      </Box>
    </TitleContainer>
  );
};

TableTitle.propTypes = {
  setSearch: PropTypes.func.isRequired,
  openCreateAllotmentModal: PropTypes.func.isRequired,
  setBlocks: PropTypes.func.isRequired,
  setAllotmentPrototypes: PropTypes.func.isRequired,
  openBlocksModal: PropTypes.func.isRequired,
};

export default TableTitle;
