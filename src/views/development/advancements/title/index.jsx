import { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Select, Avatar, DatePicker } from 'antd';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import { useDevelopment } from '@providers/development';
import { searchableFields as userSearchableFields } from '@config/constants/user';
import { searchableFields as providerSearchableFields } from '@config/constants/provider';
import { searchableFields as allotmentSearchableFields } from '@config/constants/allotment';
import Box from '@components/box';
import TitleContainer from './elements';
import { GET_USERS, GET_PROVIDERS, GET_ALLOTMENTS } from './requests';

const params = {
  page: 1,
  pageSize: 5,
};

const presets = {
  'De hoy': [
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).subtract(1, 'day'),
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
  ],
  'De ayer': [
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).subtract(2, 'day'),
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).subtract(1, 'day'),
  ],
  'De este mes': [
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).startOf('month'),
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).endOf('month'),
  ],
  'Del mes pasado': [
    moment()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .startOf('month')
      .subtract(1, 'month'),
    moment()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .endOf('month')
      .subtract(1, 'month'),
  ],
};

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TableTitle = ({ setCreatedBys, setProviders, setAllotments, setCreatedAt, setUpdatedAt }) => {
  const [userSearch, setUserSearch] = useState('');
  const [providerSearch, setProviderSearch] = useState('');
  const [allotmentSearch, setAllotmentSearch] = useState('');

  const [debouncedUserSearch] = useDebounce(userSearch, 500);
  const [debouncedProviderSearch] = useDebounce(providerSearch, 500);
  const [debouncedAllotmentSearch] = useDebounce(allotmentSearch, 500);

  const { development } = useDevelopment();

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

  const { data: allotmentsData, loading: loadingAllotments } = useQuery(GET_ALLOTMENTS, {
    variables: {
      development: {
        eq: development.id,
      },
      params,
      search: allotmentSearchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedAllotmentSearch;
        return acc;
      }, {}),
    },
    skip: !development.id,
  });

  return (
    <TitleContainer>
      <Box display="flex">
        <Title style={{ margin: 'auto 10px' }} level={3}>
          Avances de {development.name}
        </Title>
        <Box style={{ marginLeft: 'auto' }}>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Creado entre:
          </Paragraph>
          <RangePicker
            allowEmpty
            ranges={presets}
            placeholder={['Inicio', 'Fin']}
            onCalendarChange={(dates) => setCreatedAt({ gte: dates?.[0], lte: dates?.[1] })}
          />
        </Box>
        <Box style={{ marginLeft: 10 }}>
          <Paragraph style={{ margin: 0 }} type="secondary">
            Actualizado entre:
          </Paragraph>
          <RangePicker
            allowEmpty
            ranges={presets}
            placeholder={['Inicio', 'Fin']}
            onCalendarChange={(dates) => setUpdatedAt({ gte: dates?.[0], lte: dates?.[1] })}
          />
        </Box>
      </Box>
      <Box mt={10} display="flex">
        <Select
          style={{ width: 300, margin: 'auto 10px auto auto' }}
          mode="multiple"
          allowClear
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
        <Select
          style={{ width: 200, margin: 'auto 0px auto 10px' }}
          mode="multiple"
          allowClear
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
        <Select
          style={{ width: 200, margin: 'auto 0px auto 10px' }}
          mode="multiple"
          allowClear
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
    </TitleContainer>
  );
};

TableTitle.propTypes = {
  setCreatedAt: PropTypes.func.isRequired,
  setUpdatedAt: PropTypes.func.isRequired,
  setCreatedBys: PropTypes.func.isRequired,
  setProviders: PropTypes.func.isRequired,
  setAllotments: PropTypes.func.isRequired,
};

export default TableTitle;