import { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Tag, Typography, Button } from 'antd';
import moment from 'moment';
import Box from '@components/box';
import { useLocation } from 'react-router-dom';
import { searchableFields } from '@config/constants/advancement';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@apollo/client';
import urljoin from 'url-join';
import { RightOutlined } from '@ant-design/icons';
import { useDevelopment } from '@providers/development';
import { GET_ADVANCEMENTS } from './requests';
import { Container, ActionsContainer } from './elements';
import TableTitle from './title';

const { Paragraph, Title } = Typography;

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const AdvancementsTable = ({ provider, title, id, extraAction: ExtraAction, ...props }) => {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState(defaultParams);
  const [createdBys, setCreatedBys] = useState([]);
  const [allotments, setAllotments] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [sortBy, setSortBy] = useState();
  const [createdAt, setCreatedAt] = useState({
    gte: undefined,
    lte: undefined,
  });
  const [updatedAt, setUpdatedAt] = useState({
    gte: undefined,
    lte: undefined,
  });

  const [debouncedSearch] = useDebounce(search, 500);

  const { development } = useDevelopment();
  const { pathname } = useLocation();

  const { data, loading } = useQuery(GET_ADVANCEMENTS, {
    variables: {
      id,
      search: searchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedSearch;
        return acc;
      }, {}),
      development: {
        eq: development.id,
      },
      params: {
        page: Number(params.page),
        pageSize: Number(params.pageSize),
      },
      createdAt,
      updatedAt,
      sortBy,
      workload: {
        exists: false,
      },
      provider: {
        eq: provider,
      },
      createdBy:
        createdBys.length > 0
          ? {
              in: createdBys,
            }
          : undefined,
      allotment:
        allotments.length > 0
          ? {
              in: allotments,
            }
          : undefined,
      block:
        blocks.length > 0
          ? {
              in: blocks,
            }
          : undefined,
    },
    skip: !provider,
  });

  const columns = [
    {
      title: 'Folio',
      dataIndex: 'folio',
      key: 'folio',
      render: (folio) => <Tag>{folio}</Tag>,
    },
    {
      title: 'Creado por',
      dataIndex: 'createdBy',
      key: 'createdBy',
      // eslint-disable-next-line react/prop-types
      render: ({ lastName, firstName, username }) => (
        <Box>
          <Paragraph style={{ margin: 0 }}>
            {firstName} {lastName}
          </Paragraph>
          <Paragraph style={{ margin: 0 }} type="secondary">
            {username}
          </Paragraph>
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
      render: ({ allotment: { number } }) => <Title level={5}>{number}</Title>,
    },
    {
      title: 'Porcentaje de Avance',
      dataIndex: 'percentageAdvanced',
      key: 'percentageAdvanced',
      // eslint-disable-next-line react/prop-types
      render: (percentageAdvanced) => <Title level={5}>{percentageAdvanced}%</Title>,
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
          <a
            href={urljoin(pathname.replace('workloads', 'advancements'), advancement.id)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button type="primary" icon={<RightOutlined />} size="small">
              Ver
            </Button>
          </a>
          {ExtraAction && <ExtraAction advancement={advancement} />}
        </ActionsContainer>
      ),
    },
  ];

  return (
    <Box as={Container} {...props}>
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
          <TableTitle
            title={title}
            search={search}
            setSearch={setSearch}
            createdBys={createdBys}
            setCreatedBys={setCreatedBys}
            allotments={allotments}
            setAllotments={setAllotments}
            blocks={blocks}
            setBlocks={setBlocks}
            createdAt={createdAt}
            setCreatedAt={setCreatedAt}
            updatedAt={updatedAt}
            setUpdatedAt={setUpdatedAt}
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
          total: data?.advancements.info.count,
          showTotal: (total) => `${total} avances`,
          showSizeChanger: true,
          onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
          onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
          style: { marginRight: 20 },
        }}
        dataSource={data?.advancements.results}
      />
    </Box>
  );
};

AdvancementsTable.defaultProps = {
  provider: '',
  extraAction: undefined,
};

AdvancementsTable.propTypes = {
  provider: PropTypes.string,
  title: PropTypes.string.isRequired,
  id: PropTypes.object.isRequired,
  extraAction: PropTypes.func,
};

export default AdvancementsTable;
