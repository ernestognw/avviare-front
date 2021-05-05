import { useMemo } from 'react';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import theme from '@config/theme';
import useQueryParam from '@hooks/use-query-param';
import { useParams } from 'react-router-dom';
import { Card, Table, Tag, Button, Tooltip } from 'antd';
import { EditOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { types } from '@config/constants/credit-movement';
import { Container, ActionsContainer } from './elements';
import { GET_CREDIT_MOVEMENTS } from './requests';
import Title from './title';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const defaultSortBy = {
  field: 'date',
  order: 'asc',
};

const CreditMovements = () => {
  const [params, setParams] = useQueryParam('params', defaultParams);
  const [type, setType] = useQueryParam('type', '');
  const [sortBy, setSortBy] = useQueryParam('sortBy', defaultSortBy);
  const [date, setDate] = useQueryParam('date', {
    gte: undefined,
    lte: undefined,
  });
  const [createdAt, setCreatedAt] = useQueryParam('createdAt', {
    gte: undefined,
    lte: undefined,
  });
  const [updatedAt, setUpdatedAt] = useQueryParam('updatedAt', {
    gte: undefined,
    lte: undefined,
  });

  const { creditId } = useParams();

  const variables = {
    params: {
      page: Number(params.page),
      pageSize: Number(params.pageSize),
    },
    credit: {
      eq: creditId,
    },
    date,
    createdAt,
    updatedAt,
    sortBy,
  };

  if (type) variables.type = type;

  const { data, loading } = useQuery(GET_CREDIT_MOVEMENTS, { variables });

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      render: (dateToShow) => <Tag>{moment(dateToShow).format('ll')}</Tag>,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (typeName) => types[typeName],
    },
    {
      title: 'Cantidad',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      sorter: true,
      render: (amount) => amount?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
    },
    {
      title: 'Notas',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes) => notes ?? '-',
    },
    {
      title: 'TIIE',
      align: 'center',
      render: ({ credit: { addTIIE }, TIIE }) => (!addTIIE ? '0%' : `${TIIE}%`),
    },
    {
      title: 'Tasa de interés',
      dataIndex: 'credit',
      key: 'credit',
      align: 'center',
      render: ({ interestRate }) => `${interestRate}%`,
    },
    {
      title: 'Balance',
      dataIndex: 'calculations',
      key: 'calculations',
      align: 'center',
      render: ({ balance }) =>
        balance.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
    },
    {
      title: 'Tasa de interés diaria',
      dataIndex: 'calculations',
      key: 'calculations',
      align: 'center',
      render: ({ dailyInterestRate }) => `${dailyInterestRate}%`,
    },
    {
      title: 'Días transcurridos',
      dataIndex: 'calculations',
      key: 'calculations',
      align: 'center',
      render: ({ daysDifference }) => daysDifference,
    },
    {
      title: 'Intereses',
      dataIndex: 'calculations',
      key: 'calculations',
      align: 'center',
      render: ({ interests }) =>
        interests.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
    },
    {
      title: 'Añadir TIIE',
      dataIndex: 'credit',
      key: 'credit',
      align: 'center',
      // eslint-disable-next-line react/prop-types
      render: ({ addTIIE }) =>
        addTIIE ? (
          <CheckCircleTwoTone twoToneColor={theme.colors.primary} />
        ) : (
          <CloseCircleTwoTone twoToneColor="red" />
        ),
    },
    {
      title: 'Creado el',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateToShow) => <Tag>{moment(dateToShow).format('lll')}</Tag>,
    },
    {
      title: 'Última actualización',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (dateToShow) => <Tag>{moment(dateToShow).format('lll')}</Tag>,
    },
    {
      title: 'Acciones',
      // eslint-disable-next-line react/prop-types
      render: () => (
        <ActionsContainer>
          <Tooltip title="Editar movimiento">
            <Button onClick={() => {}} icon={<EditOutlined />} size="small" />
          </Tooltip>
        </ActionsContainer>
      ),
    },
  ];

  const memoizedColumns = useMemo(() => columns.map((col) => ({ ...col, ellipsis: true })), []);

  return (
    <Container>
      <Card style={{ width: '100%' }}>
        <Table
          loading={loading}
          columns={memoizedColumns}
          onChange={(_, __, { columnKey, order }, { action }) => {
            if (action === 'sort') {
              if (!order) setSortBy();
              else setSortBy({ field: columnKey, order: order === 'ascend' ? 'asc' : 'desc' });
            }
          }}
          title={() => (
            <Title
              openCreateCreditMovementModal={() => {}}
              date={date}
              setDate={setDate}
              createdAt={createdAt}
              setCreatedAt={setCreatedAt}
              updatedAt={updatedAt}
              setUpdatedAt={setUpdatedAt}
              type={type}
              setType={setType}
            />
          )}
          scroll={{
            x: true,
          }}
          rowKey="id"
          pagination={{
            current: Number(params.page),
            defaultCurrent: defaultParams.page,
            pageSize: Number(params.pageSize),
            defaultPageSize: defaultParams.pageSize,
            total: data?.creditMovements.info.count,
            showTotal: (total) => `${total} créditos`,
            showSizeChanger: true,
            onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
            onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
            style: {
              marginRight: 20,
            },
          }}
          dataSource={data?.creditMovements.results}
        />
      </Card>
    </Container>
  );
};

export default CreditMovements;
