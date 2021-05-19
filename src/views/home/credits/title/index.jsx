import PropTypes from 'prop-types';
import { Button, Input, Typography, DatePicker, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { banks as creditBanks } from '@config/constants/credit';
import { datePresets } from '@utils';
import Box from '@components/box';
import moment from 'moment';
import TitleContainer from './elements';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TableTitle = ({
  search,
  setSearch,
  end,
  setEnd,
  createdAt,
  setCreatedAt,
  updatedAt,
  setUpdatedAt,
  banks,
  setBanks,
  openCreateCreditModal,
}) => {
  return (
    <TitleContainer>
      <Box display="flex">
        <Title style={{ margin: 'auto 10px' }} level={3}>
          Créditos
        </Title>
        <Search
          style={{ width: 250, margin: 'auto 10px auto auto' }}
          allowClear
          value={search}
          placeholder="Buscar créditos"
          onChange={({ target: { value } }) => setSearch(value)}
        />
        <Select
          style={{ width: 250, margin: 'auto 10px' }}
          mode="multiple"
          allowClear
          value={banks}
          placeholder="Filtrar por banco"
          onChange={setBanks}
        >
          {Object.keys(creditBanks).map((bank) => (
            <Option key={bank} value={bank}>
              {creditBanks[bank]}
            </Option>
          ))}
        </Select>
        <Button
          onClick={openCreateCreditModal}
          style={{ margin: 'auto 10px' }}
          type="primary"
          icon={<PlusOutlined />}
        >
          Añadir
        </Button>
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
            Finaliza entre:
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
  end: {},
  banks: [],
};

TableTitle.propTypes = {
  openCreateCreditModal: PropTypes.func.isRequired,
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  createdAt: PropTypes.object,
  setCreatedAt: PropTypes.func.isRequired,
  updatedAt: PropTypes.object,
  setUpdatedAt: PropTypes.func.isRequired,
  end: PropTypes.object,
  setEnd: PropTypes.func.isRequired,
  banks: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(creditBanks))),
  setBanks: PropTypes.func.isRequired,
};

export default TableTitle;
