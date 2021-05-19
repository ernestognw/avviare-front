import { useMemo, useState } from 'react';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import urljoin from 'url-join';
import theme from '@config/theme';
import { useLocation, Link } from 'react-router-dom';
import useQueryParam from '@hooks/use-query-param';
import { Card, Table, Tag, Button, Tooltip } from 'antd';
import {
  EditOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  RightOutlined,
} from '@ant-design/icons';
import { searchableFields, banks as creditBanks } from '@config/constants/credit';
import { Container, ActionsContainer } from './elements';
import { GET_CREDITS } from './requests';
import Title from './title';
import CreateCreditModal from './create-credit-modal';
import EditCreditModal from './edit-credit-modal';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Credits = () => {
  const [creditEditId, setCreditEditId] = useState(null);
  const [isOpenCreateCreditModal, toggleCreateCreditModal] = useState(false);
  const { pathname } = useLocation();

  const [params, setParams] = useQueryParam('params', defaultParams);
  const [search, setSearch] = useQueryParam('search', '');
  const [debouncedSearch] = useDebounce(search, 500);
  const [banks, setBanks] = useQueryParam('banks', []);
  const [createdAt, setCreatedAt] = useQueryParam('createdAt', {
    gte: undefined,
    lte: undefined,
  });
  const [updatedAt, setUpdatedAt] = useQueryParam('updatedAt', {
    gte: undefined,
    lte: undefined,
  });
  const [end, setEnd] = useQueryParam('end', {
    gte: undefined,
    lte: undefined,
  });

  const variables = {
    params: {
      page: Number(params.page),
      pageSize: Number(params.pageSize),
    },
    search: searchableFields.reduce((acc, curr) => {
      acc[curr] = debouncedSearch;
      return acc;
    }, {}),
    type: 'SIMPLE',
    createdAt,
    updatedAt,
    bank:
      banks.length > 0
        ? {
            in: banks,
          }
        : undefined,
    end,
  };

  const { data, loading, refetch } = useQuery(GET_CREDITS, { variables });

  const columns = [
    {
      title: 'Número',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Banco',
      dataIndex: 'bank',
      key: 'bank',
      render: (bank) => creditBanks[bank],
    },
    {
      title: 'Fecha de finalización',
      dataIndex: 'end',
      key: 'end',
      render: (date) => <Tag>{moment(date).format('ll')}</Tag>,
    },
    {
      title: 'Día de TIIE',
      dataIndex: 'TIIEDay',
      key: 'TIIEDay',
      align: 'center',
    },
    {
      title: 'Día de corte',
      dataIndex: 'billingDay',
      key: 'billingDay',
      align: 'center',
    },
    {
      title: 'Día de pago',
      dataIndex: 'paymentDay',
      key: 'paymentDay',
      align: 'center',
    },
    {
      title: 'Tasa de interés base',
      dataIndex: 'interestRate',
      key: 'interestRate',
      align: 'center',
      render: (interestRate) => `${interestRate}%`,
    },
    {
      title: 'Tasa de interés moratoria',
      dataIndex: 'defaultInterestRate',
      key: 'defaultInterestRate',
      align: 'center',
      render: (defaultInterestRate) => `${defaultInterestRate}%`,
    },
    {
      title: 'Añadir TIIE',
      dataIndex: 'addTIIE',
      key: 'addTIIE',
      align: 'center',
      render: (addTIIE) =>
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
      render: (date) => <Tag>{moment(date).format('lll')}</Tag>,
    },
    {
      title: 'Última actualización',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => <Tag>{moment(date).format('lll')}</Tag>,
    },
    {
      title: 'Acciones',
      // eslint-disable-next-line react/prop-types
      render: ({ id }) => (
        <ActionsContainer>
          <Link to={urljoin(pathname, id)}>
            <Button type="primary" icon={<RightOutlined />} size="small">
              Ver
            </Button>
          </Link>
          <Tooltip title="Editar crédito">
            <Button
              style={{ marginLeft: 10 }}
              icon={<EditOutlined />}
              size="small"
              onClick={() => setCreditEditId(id)}
            />
          </Tooltip>
        </ActionsContainer>
      ),
    },
  ];

  const memoizedColumns = useMemo(() => columns.map((col) => ({ ...col, ellipsis: true })), []);

  return (
    <>
      <Container>
        <Card style={{ width: '100%' }}>
          <Table
            loading={loading}
            columns={memoizedColumns}
            title={() => (
              <Title
                search={search}
                openCreateCreditModal={() => toggleCreateCreditModal(true)}
                setSearch={setSearch}
                end={end}
                setEnd={setEnd}
                createdAt={createdAt}
                setCreatedAt={setCreatedAt}
                updatedAt={updatedAt}
                setUpdatedAt={setUpdatedAt}
                banks={banks}
                setBanks={setBanks}
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
              total: data?.credits.info.count,
              showTotal: (total) => `${total} créditos`,
              showSizeChanger: true,
              onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              style: {
                marginRight: 20,
              },
            }}
            dataSource={data?.credits.results}
          />
        </Card>
      </Container>
      <CreateCreditModal
        visible={isOpenCreateCreditModal}
        onClose={() => toggleCreateCreditModal(false)}
        updateCredits={refetch}
      />
      <EditCreditModal
        visible={!!creditEditId}
        creditEditId={creditEditId}
        onClose={() => setCreditEditId(null)}
      />
    </>
  );
};

export default Credits;
