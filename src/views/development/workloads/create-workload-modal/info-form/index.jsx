import { useState } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Typography, Select } from 'antd';
import Box from '@components/box';
import moment from 'moment';
import { useDevelopment } from '@providers/development';
import { datePresets } from '@utils';
import { useDebounce } from 'use-debounce';
import { searchableFields } from '@config/constants/provider';
import { useQuery } from '@apollo/client';
import { GET_PROVIDERS } from './requests';

const { RangePicker } = DatePicker;
const { Paragraph } = Typography;
const { Option } = Select;

const params = {
  page: 1,
  pageSize: 10,
};

const InfoForm = ({ provider, setProvider, start, setStart, end, setEnd, disabled }) => {
  const [search, setSearch] = useState('');

  const [debouncedSearch] = useDebounce(search, 500);

  const { development } = useDevelopment();

  const { data, loading } = useQuery(GET_PROVIDERS, {
    variables: {
      search: searchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedSearch;
        return acc;
      }, {}),
      params,
      worksAt: {
        eq: development.id,
      },
    },
  });

  return (
    <Box py={20}>
      <Box>
        <Paragraph style={{ margin: 0 }} type="secondary">
          Periodo
        </Paragraph>
        <RangePicker
          value={[start, end]}
          ranges={datePresets}
          disabled={disabled}
          placeholder={['Inicio', 'Fin']}
          onCalendarChange={(dates) => {
            setStart(dates?.[0]);
            setEnd(dates?.[1]);
          }}
        />
      </Box>
      <Box mt={10}>
        <Paragraph style={{ margin: 0 }} type="secondary">
          Proveedor
        </Paragraph>
        <Select
          style={{ width: 300, margin: 'auto 0px auto auto' }}
          allowClear
          value={provider}
          loading={loading}
          onSearch={setSearch}
          filterOption={false}
          disabled={disabled}
          showSearch
          onChange={setProvider}
        >
          {data?.providers.results.map(({ id, businessName, RFC }) => (
            <Option key={id} value={id}>
              <Paragraph style={{ margin: 0 }}>{businessName}</Paragraph>
              <Paragraph style={{ margin: 0 }} type="secondary">
                {RFC}
              </Paragraph>
            </Option>
          ))}
        </Select>
      </Box>
    </Box>
  );
};

InfoForm.defaultProps = {
  provider: '',
  start: undefined,
  end: undefined,
  disabled: false,
};

InfoForm.propTypes = {
  provider: PropTypes.string,
  setProvider: PropTypes.func.isRequired,
  start: PropTypes.instanceOf(moment),
  setStart: PropTypes.func.isRequired,
  end: PropTypes.instanceOf(moment),
  setEnd: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default InfoForm;
