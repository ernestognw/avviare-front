import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Select, Avatar, DatePicker, Input } from 'antd';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@apollo/client';
import { datePresets } from '@utils';
import moment from 'moment';
import { useDevelopment } from '@providers/development';
import { searchableFields as userSearchableFields } from '@config/constants/user';
import { searchableFields as allotmentSearchableFields } from '@config/constants/allotment';
import { searchableFields as blockSearchableFields } from '@config/constants/block';
import Box from '@components/box';
import TitleContainer from './elements';
import { GET_USERS, GET_ALLOTMENTS, GET_BLOCKS } from './requests';

const params = {
  page: 1,
  pageSize: 5,
};

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const TableTitle = ({
  title,
  search,
  setSearch,
  createdBys,
  setCreatedBys,
  allotments,
  setAllotments,
  blocks,
  setBlocks,
  createdAt,
  setCreatedAt,
  updatedAt,
  setUpdatedAt,
}) => {
  const [userSearch, setUserSearch] = useState('');
  const [allotmentSearch, setAllotmentSearch] = useState('');
  const [blockSearch, setBlockSearch] = useState('');

  const [debouncedUserSearch] = useDebounce(userSearch, 500);
  const [debouncedAllotmentSearch] = useDebounce(allotmentSearch, 500);
  const [debouncedBlocksearch] = useDebounce(blockSearch, 500);

  const { development } = useDevelopment();

  const memoizedQueryOptions = (searchableFields, debouncedSearch, options = {}) =>
    useMemo(
      () => ({
        variables: {
          [options.useWorksAtInstedOfDevelopment ? 'worksAt' : 'development']: {
            eq: development.id,
          },
          params,
          search: debouncedSearch
            ? searchableFields.reduce((acc, curr) => {
                acc[curr] = debouncedSearch;
                return acc;
              }, {})
            : undefined,
        },
        skip: !development.id || options.skip,
      }),
      [debouncedSearch]
    );

  const [
    { data: usersData, loading: loadingUsers },
    { data: allotmentsData, loading: loadingAllotments },
    { data: blocksData, loading: loadingBlocks },
  ] = [
    useQuery(
      GET_USERS,
      memoizedQueryOptions(userSearchableFields, debouncedUserSearch, {
        useWorksAtInstedOfDevelopment: true,
      })
    ),
    useQuery(
      GET_ALLOTMENTS,
      memoizedQueryOptions(allotmentSearchableFields, debouncedAllotmentSearch)
    ),
    useQuery(GET_BLOCKS, memoizedQueryOptions(blockSearchableFields, debouncedBlocksearch)),
  ];

  return (
    <TitleContainer>
      <Box display="flex">
        <Title style={{ margin: 'auto 10px' }} level={3}>
          {title}
        </Title>
        <Search
          style={{ width: 350, margin: 'auto 10px auto auto' }}
          allowClear
          value={search}
          placeholder="Buscar avances"
          onChange={({ target: { value } }) => setSearch(value)}
        />
      </Box>
      <Box mt={10} display="flex">
        <Box style={{ marginLeft: 'auto' }}>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Creado entre:
          </Paragraph>
          <RangePicker
            allowEmpty
            value={[
              createdAt.gte ? moment(createdAt.gte) : undefined,
              createdAt.lte ? moment(createdAt.lte) : undefined,
            ]}
            ranges={datePresets}
            placeholder={['Inicio', 'Fin']}
            onCalendarChange={(dates) =>
              setCreatedAt({ gte: dates?.[0]?.toISOString(), lte: dates?.[1]?.toISOString() })
            }
          />
        </Box>
        <Box style={{ marginLeft: 10 }}>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Actualizado entre:
          </Paragraph>
          <RangePicker
            allowEmpty
            value={[
              updatedAt.gte ? moment(updatedAt.gte) : undefined,
              updatedAt.lte ? moment(updatedAt.lte) : undefined,
            ]}
            ranges={datePresets}
            placeholder={['Inicio', 'Fin']}
            onCalendarChange={(dates) =>
              setUpdatedAt({ gte: dates?.[0]?.toISOString(), lte: dates?.[1]?.toISOString() })
            }
          />
        </Box>
        <Box style={{ marginLeft: 10 }}>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Creadores
          </Paragraph>
          <Select
            style={{ width: 200, margin: 'auto 0px auto 0px' }}
            mode="multiple"
            allowClear
            value={createdBys}
            loading={loadingUsers}
            onSearch={setUserSearch}
            filterOption={false}
            showSearch
            placeholder="Filtrar por creador"
            onChange={setCreatedBys}
            optionLabelProp="label"
          >
            {usersData?.users.results.map(({ id, firstName, lastName, profileImg, username }) => (
              <Option key={id} value={id} label={`${firstName} ${lastName}`}>
                <Box display="flex" alignItems="center">
                  <Avatar src={profileImg} />
                  <Box ml={12}>
                    <Paragraph style={{ margin: 0 }}>
                      {firstName} {lastName}
                    </Paragraph>
                    <Paragraph style={{ margin: 0 }} type="secondary">
                      {username}
                    </Paragraph>
                  </Box>
                </Box>
              </Option>
            ))}
          </Select>
        </Box>
      </Box>
      <Box mt={10} display="flex">
        <Box style={{ marginLeft: 'auto' }}>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Lotes
          </Paragraph>
          <Select
            style={{ width: 200, margin: 'auto 0px auto auto' }}
            mode="multiple"
            allowClear
            value={allotments}
            loading={loadingAllotments}
            onSearch={setAllotmentSearch}
            filterOption={false}
            showSearch
            placeholder="Filtrar por lote"
            onChange={setAllotments}
          >
            {allotmentsData?.allotments.results.map(({ id, number }) => (
              <Option key={id} value={id}>
                {number}
              </Option>
            ))}
          </Select>
        </Box>
        <Box style={{ marginLeft: 10 }}>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Manzanas
          </Paragraph>
          <Select
            style={{ width: 200, margin: 'auto 0px auto 10px' }}
            mode="multiple"
            allowClear
            value={blocks}
            loading={loadingBlocks}
            onSearch={setBlockSearch}
            filterOption={false}
            showSearch
            placeholder="Filtrar por manzana"
            onChange={setBlocks}
          >
            {blocksData?.blocks.results.map(({ id, number }) => (
              <Option key={id} value={id}>
                {number}
              </Option>
            ))}
          </Select>
        </Box>
      </Box>
    </TitleContainer>
  );
};

TableTitle.defaultProps = {
  search: '',
  createdAt: {},
  updatedAt: {},
  createdBys: [],
  allotments: [],
  blocks: [],
};

TableTitle.propTypes = {
  title: PropTypes.string.isRequired,
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  createdAt: PropTypes.object,
  setCreatedAt: PropTypes.func.isRequired,
  updatedAt: PropTypes.object,
  setUpdatedAt: PropTypes.func.isRequired,
  createdBys: PropTypes.arrayOf(PropTypes.string),
  setCreatedBys: PropTypes.func.isRequired,
  allotments: PropTypes.arrayOf(PropTypes.string),
  setAllotments: PropTypes.func.isRequired,
  blocks: PropTypes.arrayOf(PropTypes.string),
  setBlocks: PropTypes.func.isRequired,
};

export default TableTitle;
