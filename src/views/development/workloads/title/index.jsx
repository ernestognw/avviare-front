import { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Select, Avatar, DatePicker, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import { datePresets } from '@utils';
import { useDevelopment } from '@providers/development';
import { searchableFields as userSearchableFields } from '@config/constants/user';
import { searchableFields as providerSearchableFields } from '@config/constants/provider';
import Box from '@components/box';
import TitleContainer from './elements';
import { GET_USERS, GET_PROVIDERS } from './requests';

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
  createdAt,
  setCreatedAt,
  start,
  setStart,
  end,
  setEnd,
  updatedAt,
  setUpdatedAt,
  openCreateWorkloadModal,
}) => {
  const [userSearch, setUserSearch] = useState('');
  const [providerSearch, setProviderSearch] = useState('');

  const [debouncedUserSearch] = useDebounce(userSearch, 500);
  const [debouncedProviderSearch] = useDebounce(providerSearch, 500);

  const { development, developmentRole } = useDevelopment();

  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS, {
    variables: {
      worksAt: {
        eq: development.id,
      },
      params,
      search: userSearchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedUserSearch;
        return acc;
      }, {}),
    },
    skip: !development.id,
  });

  const { data: providersData, loading: loadingProviders } = useQuery(GET_PROVIDERS, {
    variables: {
      worksAt: {
        eq: development.id,
      },
      params,
      search: providerSearchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedProviderSearch;
        return acc;
      }, {}),
    },
    skip: !development.id,
  });

  return (
    <TitleContainer>
      <Box display="flex">
        <Title style={{ margin: 'auto 10px', marginLeft: 0 }} level={3}>
          Estimaciones de {development.name}
        </Title>
        <Search
          style={{ width: 350, margin: 'auto 10px auto auto' }}
          allowClear
          value={search}
          placeholder="Buscar estimaciones"
          onChange={({ target: { value } }) => setSearch(value)}
        />
        <Button
          style={{ marginLeft: 10 }}
          type="primary"
          disabled={!developmentRole.manager}
          icon={<PlusOutlined />}
          onClick={openCreateWorkloadModal}
        >
          A??adir
        </Button>
      </Box>
      <Box mt={10} display="flex">
        <Box style={{ marginLeft: 'auto' }}>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Proveedores
          </Paragraph>
          <Select
            style={{ width: 300, margin: 'auto 10px auto auto' }}
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
            style={{ width: 200, margin: 'auto 0px auto 10px' }}
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
            Inici?? entre:
          </Paragraph>
          <RangePicker
            allowEmpty
            value={[
              start.gte ? moment(start.gte) : undefined,
              start.lte ? moment(start.lte) : undefined,
            ]}
            ranges={datePresets}
            placeholder={['Inicio', 'Fin']}
            onCalendarChange={(dates) =>
              setStart({ gte: dates?.[0]?.toISOString(), lte: dates?.[1]?.toISOString() })
            }
          />
        </Box>
        <Box style={{ marginLeft: 10 }}>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Finaliz?? entre:
          </Paragraph>
          <RangePicker
            allowEmpty
            value={[end.gte ? moment(end.gte) : undefined, end.lte ? moment(end.lte) : undefined]}
            ranges={datePresets}
            placeholder={['Inicio', 'Fin']}
            onCalendarChange={(dates) =>
              setEnd({ gte: dates?.[0]?.toISOString(), lte: dates?.[1]?.toISOString() })
            }
          />
        </Box>
      </Box>
    </TitleContainer>
  );
};

TableTitle.defaultProps = {
  search: '',
  createdAt: {},
  updatedAt: {},
  start: {},
  end: {},
  createdBys: [],
  providers: [],
};

TableTitle.propTypes = {
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  createdAt: PropTypes.object,
  setCreatedAt: PropTypes.func.isRequired,
  updatedAt: PropTypes.object,
  setUpdatedAt: PropTypes.func.isRequired,
  start: PropTypes.object,
  setStart: PropTypes.func.isRequired,
  end: PropTypes.object,
  setEnd: PropTypes.func.isRequired,
  createdBys: PropTypes.arrayOf(PropTypes.string),
  setCreatedBys: PropTypes.func.isRequired,
  providers: PropTypes.arrayOf(PropTypes.string),
  setProviders: PropTypes.func.isRequired,
  openCreateWorkloadModal: PropTypes.func.isRequired,
};

export default TableTitle;
