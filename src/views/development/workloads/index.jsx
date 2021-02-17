import { Card, Table, Button, Tag, Avatar, Typography } from 'antd';
import { useDevelopment } from '@providers/development';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import moment from 'moment';
import useQueryParam from '@hooks/use-query-param';
import { stringify } from 'qs';
import { RightOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import theme from '@config/theme';
import Box from '@components/box';
import Title from './title';
import { Container, ActionsContainer } from './elements';
import { GET_WORKLOADS } from './requests';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const { Paragraph, Title: TypographyTitle } = Typography;

const Workloads = () => {
  const [params, setParams] = useQueryParam('params', defaultParams);
  const [createdBys, setCreatedBys] = useQueryParam('createdBys', []);
  const [providers, setProviders] = useQueryParam('providers', []);
  const [sortBy, setSortBy] = useQueryParam('sortBy');
  const [createdAt, setCreatedAt] = useQueryParam('createdAt', {
    gte: undefined,
    lte: undefined,
  });
  const [updatedAt, setUpdatedAt] = useQueryParam('updatedAt', {
    gte: undefined,
    lte: undefined,
  });
  const [start, setStart] = useQueryParam('start', {
    gte: undefined,
    lte: undefined,
  });
  const [end, setEnd] = useQueryParam('end', {
    gte: undefined,
    lte: undefined,
  });

  const { development } = useDevelopment();

  const { data, loading } = useQuery(GET_WORKLOADS, {
    variables: {
      development: {
        eq: development.id,
      },
      params: {
        page: Number(params.page),
        pageSize: Number(params.pageSize),
      },
      createdAt,
      updatedAt,
      start,
      end,
      sortBy,
      createdBy:
        createdBys.length > 0
          ? {
              in: createdBys,
            }
          : undefined,
      provider:
        providers.length > 0
          ? {
              in: providers,
            }
          : undefined,
    },
  });

  const columns = [
    {
      title: 'Creado por',
      dataIndex: 'createdBy',
      key: 'createdBy',
      // eslint-disable-next-line react/prop-types
      render: ({ profileImg, lastName, firstName, username }) => (
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
      ),
    },
    {
      title: 'Proveedor',
      dataIndex: 'provider',
      key: 'provider',
      // eslint-disable-next-line react/prop-types
      render: ({ businessName, RFC }) => (
        <Box>
          <Paragraph style={{ margin: 0 }}>{businessName}</Paragraph>
          <Tag>{RFC}</Tag>
        </Box>
      ),
    },
    {
      title: 'Avances incluidos',
      dataIndex: 'advancements',
      key: 'advancements',
      // eslint-disable-next-line react/prop-types
      render: ({ info: { count } }) => <TypographyTitle level={5}>{count}</TypographyTitle>,
    },
    {
      title: 'Pagado',
      dataIndex: 'paid',
      key: 'paid',
      render: (paid) =>
        paid ? (
          <CheckCircleTwoTone twoToneColor={theme.colors.primary} />
        ) : (
          <CloseCircleTwoTone twoToneColor="red" />
        ),
    },
    {
      title: 'Inicio',
      dataIndex: 'start',
      key: 'start',
      sorter: true,
      render: (date) => <Tag>{moment(date).format('lll')}</Tag>,
    },
    {
      title: 'Final',
      dataIndex: 'end',
      key: 'end',
      sorter: true,
      render: (date) => <Tag>{moment(date).format('lll')}</Tag>,
    },
    {
      title: 'Creado el',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date) => <Tag>{moment(date).format('lll')}</Tag>,
    },
    {
      title: 'Última actualización',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: true,
      render: (date) => <Tag>{moment(date).format('lll')}</Tag>,
    },
    {
      title: 'Acciones',
      fixed: 'right',
      render: (workload) => (
        <ActionsContainer>
          <Link
            to={`/development/${development.id}/advancements?${stringify({
              workload: { eq: workload.id },
            })}`}
          >
            <Button type="primary" icon={<RightOutlined />} size="small">
              Ver avances
            </Button>
          </Link>
        </ActionsContainer>
      ),
    },
  ];

  return (
    <>
      <Container>
        <Card style={{ width: '100%', padding: 0 }}>
          <Table
            loading={loading}
            columns={columns}
            showSorterTooltip={false}
            onChange={(pagination, filters, { columnKey, order }, { action }) => {
              if (action === 'sort') {
                if (!order) setSortBy();
                else setSortBy({ field: columnKey, order: order === 'ascend' ? 'asc' : 'desc' });
              }
            }}
            title={() => (
              <Title
                updatedAt={updatedAt}
                setUpdatedAt={setUpdatedAt}
                createdAt={createdAt}
                setCreatedAt={setCreatedAt}
                createdBys={createdBys}
                setCreatedBys={setCreatedBys}
                start={start}
                setStart={setStart}
                end={end}
                setEnd={setEnd}
                providers={providers}
                setProviders={setProviders}
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
              total: data?.workloads.info.count,
              showTotal: (total) => `${total} estimaciones`,
              showSizeChanger: true,
              onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              style: { marginRight: 20 },
            }}
            dataSource={data?.workloads.results}
          />
        </Card>
      </Container>
    </>
  );
};

export default Workloads;
