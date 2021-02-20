import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Select, Avatar, DatePicker, Input } from 'antd';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@apollo/client';
import { datePresets } from '@utils';
import moment from 'moment';
import { useDevelopment } from '@providers/development';
import { searchableFields as userSearchableFields } from '@config/constants/user';
import { searchableFields as providerSearchableFields } from '@config/constants/provider';
import { searchableFields as allotmentSearchableFields } from '@config/constants/allotment';
import { searchableFields as blockSearchableFields } from '@config/constants/block';
import { searchableFields as workloadSearchableFields } from '@config/constants/workload';
import Box from '@components/box';
import TitleContainer from './elements';
import { GET_USERS, GET_PROVIDERS, GET_ALLOTMENTS, GET_BLOCKS, GET_WORKLOADS } from './requests';

const params = {
  page: 1,
  pageSize: 5,
};

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const TableTitle = ({
  search,
  setSearch,
  createdBys,
  setCreatedBys,
  providers,
  setProviders,
  allotments,
  setAllotments,
  blocks,
  setBlocks,
  createdAt,
  setCreatedAt,
  updatedAt,
  setUpdatedAt,
  workloads,
  workloadExists,
  setWorkloadExists,
}) => {
  const [userSearch, setUserSearch] = useState('');
  const [providerSearch, setProviderSearch] = useState('');
  const [allotmentSearch, setAllotmentSearch] = useState('');
  const [blockSearch, setBlockSearch] = useState('');

  const [debouncedUserSearch] = useDebounce(userSearch, 500);
  const [debouncedProviderSearch] = useDebounce(providerSearch, 500);
  const [debouncedAllotmentSearch] = useDebounce(allotmentSearch, 500);
  const [debouncedBlocksearch] = useDebounce(blockSearch, 500);

  const { development } = useDevelopment();

  const memoizedQueryOptions = (searchableFields, debouncedSearch, selected = [], options = {}) =>
    useMemo(
      () => ({
        variables: {
          worksAt: {
            eq: development.id,
          },
          params,
          search: debouncedSearch
            ? searchableFields.reduce((acc, curr) => {
                acc[curr] = debouncedSearch;
                return acc;
              }, {})
            : undefined,
          id:
            selected.length > 0 // If pre selected wanted
              ? {
                  in: selected,
                }
              : undefined,
        },
        skip: !development.id || options.skip,
      }),
      [debouncedSearch]
    );

  const [
    { data: usersData, loading: loadingUsers },
    { data: providersData, loading: loadingProviders },
    { data: allotmentsData, loading: loadingAllotments },
    { data: blocksData, loading: loadingBlocks },
    { data: workloadsData, loading: loadingWorkloads },
  ] = [
    useQuery(GET_USERS, memoizedQueryOptions(userSearchableFields, debouncedUserSearch)),
    useQuery(
      GET_PROVIDERS,
      memoizedQueryOptions(providerSearchableFields, debouncedProviderSearch)
    ),
    useQuery(
      GET_ALLOTMENTS,
      memoizedQueryOptions(allotmentSearchableFields, debouncedAllotmentSearch)
    ),
    useQuery(GET_BLOCKS, memoizedQueryOptions(blockSearchableFields, debouncedBlocksearch)),
    useQuery(
      GET_WORKLOADS,
      memoizedQueryOptions(workloadSearchableFields, '', workloads, {
        skip: workloads.length === 0,
      })
    ),
  ];

  return (
    <TitleContainer>
      <Box display="flex">
        <Title style={{ margin: 'auto 10px' }} level={3}>
          Avances de {development.name}
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
            Proveedores
          </Paragraph>
          <Select
            style={{ width: 300, margin: 'auto 0px auto auto' }}
            mode="multiple"
            allowClear
            value={providers}
            loading={loadingProviders}
            onSearch={setProviderSearch}
            filterOption={false}
            showSearch
            placeholder="Filtrar por proveedor"
            onChange={setProviders}
          >
            {providersData?.providers.results.map(({ id, businessName, RFC }) => (
              <Option key={id} value={id}>
                <Paragraph style={{ margin: 0 }}>{businessName}</Paragraph>
                <Paragraph style={{ margin: 0 }} type="secondary">
                  {RFC}
                </Paragraph>
              </Option>
            ))}
          </Select>
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
        <Box style={{ marginLeft: 10 }}>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Estimados
          </Paragraph>
          <Select
            style={{ width: 200, margin: 'auto 0px auto 10px' }}
            value={String(workloadExists)}
            placeholder="Estimados"
            onChange={(value) => setWorkloadExists(eval(value))}
          >
            <Option value="undefined">Todos</Option>
            <Option value="true">Estimados</Option>
            <Option value="false">No estimados</Option>
          </Select>
        </Box>
        {workloads.length > 0 && ( // Only show when passed by param
          <Box style={{ marginLeft: 10 }}>
            <Paragraph style={{ margin: 0 }} type="secondary">
              Estimaciones
            </Paragraph>
            <Select
              style={{ width: 200, margin: 'auto 0px auto 10px' }}
              mode="multiple"
              allowClear
              value={workloads}
              loading={loadingWorkloads}
              filterOption={false}
              showSearch
              placeholder="Filtrar por estimación"
              disabled
            >
              {workloadsData?.workloads.results.map(({ id, folio }) => (
                <Option key={id} value={id}>
                  {folio}
                </Option>
              ))}
            </Select>
          </Box>
        )}
      </Box>
    </TitleContainer>
  );
};

TableTitle.defaultProps = {
  search: '',
  createdAt: {},
  updatedAt: {},
  createdBys: [],
  providers: [],
  allotments: [],
  blocks: [],
  workloadExists: undefined,
  workloads: [],
};

TableTitle.propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  createdAt: PropTypes.object,
  setCreatedAt: PropTypes.func.isRequired,
  updatedAt: PropTypes.object,
  setUpdatedAt: PropTypes.func.isRequired,
  createdBys: PropTypes.arrayOf(PropTypes.string),
  setCreatedBys: PropTypes.func.isRequired,
  providers: PropTypes.arrayOf(PropTypes.string),
  setProviders: PropTypes.func.isRequired,
  allotments: PropTypes.arrayOf(PropTypes.string),
  setAllotments: PropTypes.func.isRequired,
  blocks: PropTypes.arrayOf(PropTypes.string),
  setBlocks: PropTypes.func.isRequired,
  workloadExists: PropTypes.bool,
  setWorkloadExists: PropTypes.func.isRequired,
  workloads: PropTypes.arrayOf(PropTypes.string),
};

export default TableTitle;
