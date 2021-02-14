import { useState } from 'react';
import { Card, Table, Button, Tag, Avatar, Typography } from 'antd';
import { useDevelopment } from '@providers/development';
import { useQuery } from '@apollo/client';
import urljoin from 'url-join';
import moment from 'moment';
import { RightOutlined } from '@ant-design/icons';
import { useLocation, Link } from 'react-router-dom';
import Box from '@components/box';
import Title from './title';
import { Container, ActionsContainer } from './elements';
import { GET_ADVANCEMENTS } from './requests';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const { Paragraph, Title: TypographyTitle } = Typography;

const Advancements = () => {
  const [params, setParams] = useState(defaultParams);
  const [createdBys, setCreatedBys] = useState([]);
  const [providers, setProviders] = useState([]);
  const [allotments, setAllotments] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [createdAt, setCreatedAt] = useState({
    gte: undefined,
    lte: undefined,
  });
  const [updatedAt, setUpdatedAt] = useState({
    gte: undefined,
    lte: undefined,
  });

  const { development } = useDevelopment();
  const { pathname } = useLocation();

  const { data, loading } = useQuery(GET_ADVANCEMENTS, {
    variables: {
      development: {
        eq: development.id,
      },
      params,
      createdAt,
      updatedAt,
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
      allotment:
        allotments.length > 0
          ? {
              in: allotments,
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
      title: 'Subconcepto',
      dataIndex: 'subconceptInstance',
      key: 'subconceptInstance',
      // eslint-disable-next-line react/prop-types
      render: ({ subconcept: { name, code } }) => (
        <Box>
          <Paragraph style={{ margin: 0 }}>{name}</Paragraph>
          <Tag>{code}</Tag>
        </Box>
      ),
    },
    {
      title: 'Lote',
      dataIndex: 'subconceptInstance',
      key: 'subconceptInstance',
      // eslint-disable-next-line react/prop-types
      render: ({ allotment: { number } }) => <TypographyTitle level={5}>{number}</TypographyTitle>,
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
      title: 'Porcentaje de Avance',
      dataIndex: 'percentageAdvanced',
      key: 'percentageAdvanced',
      // eslint-disable-next-line react/prop-types
      render: (percentageAdvanced) => (
        <TypographyTitle level={5}>{percentageAdvanced}%</TypographyTitle>
      ),
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
      render: (advancement) => (
        <ActionsContainer>
          <Link to={urljoin(pathname, advancement.id)}>
            <Button type="primary" icon={<RightOutlined />} size="small">
              Ver
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
                setUpdatedAt={setUpdatedAt}
                setCreatedAt={setCreatedAt}
                setCreatedBys={setCreatedBys}
                setProviders={setProviders}
                setAllotments={setAllotments}
              />
            )}
            scroll={{
              x: true,
            }}
            rowKey="id"
            pagination={{
              current: params.page,
              defaultCurrent: defaultParams.page,
              pageSize: params.pageSize,
              defaultPageSize: defaultParams.pageSize,
              total: data?.advancements.info.count,
              showTotal: (total) => `${total} avances`,
              showSizeChanger: true,
              onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              style: { marginRight: 20 },
            }}
            dataSource={data?.advancements.results}
          />
        </Card>
      </Container>
    </>
  );
};

export default Advancements;
