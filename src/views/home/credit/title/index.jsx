import PropTypes from 'prop-types';
import { Button, Typography, DatePicker, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { types } from '@config/constants/credit-movement';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { datePresets } from '@utils';
import Box from '@components/box';
import moment from 'moment';
import TitleContainer from './elements';
import { GET_CREDIT } from './requests';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TableTitle = ({
  date,
  setDate,
  createdAt,
  setCreatedAt,
  updatedAt,
  setUpdatedAt,
  type,
  setType,
  openCreateCreditMovementModal,
}) => {
  const { creditId } = useParams();

  const { data } = useQuery(GET_CREDIT, {
    variables: {
      id: creditId,
    },
  });

  return (
    <TitleContainer>
      <Box display="flex">
        <Title style={{ margin: 'auto 10px' }} level={3}>
          Movimientos del crédito {data?.credit.number}
        </Title>
        <Select
          style={{ width: 250, margin: 'auto 10px auto auto' }}
          allowClear
          value={type}
          onChange={setType}
        >
          <option value="" hidden>
            Filtrar por tipo
          </option>
          {Object.keys(types).map((typeKey) => (
            <Option key={typeKey} value={typeKey}>
              {types[typeKey]}
            </Option>
          ))}
        </Select>
        <Button
          onClick={openCreateCreditMovementModal}
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
            Realizado entre:
          </Paragraph>
          <RangePicker
            allowEmpty
            value={[
              date.gte ? moment(date.gte) : undefined,
              date.lte ? moment(date.lte) : undefined,
            ]}
            ranges={datePresets}
            placeholder={['Inicio', 'Fin']}
            onCalendarChange={(dates) =>
              setDate({ gte: dates?.[0]?.toISOString(), lte: dates?.[1]?.toISOString() })
            }
          />
        </Box>
      </Box>
    </TitleContainer>
  );
};

TableTitle.defaultProps = {
  createdAt: {},
  updatedAt: {},
  date: {},
  type: '',
};

TableTitle.propTypes = {
  openCreateCreditMovementModal: PropTypes.func.isRequired,
  createdAt: PropTypes.object,
  setCreatedAt: PropTypes.func.isRequired,
  updatedAt: PropTypes.object,
  setUpdatedAt: PropTypes.func.isRequired,
  date: PropTypes.object,
  setDate: PropTypes.func.isRequired,
  type: PropTypes.string,
  setType: PropTypes.func.isRequired,
};

export default TableTitle;
