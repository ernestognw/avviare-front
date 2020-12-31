import { useState } from 'react';
import { Card, Table, Tooltip, Button, Tag } from 'antd';
import { useDevelopment } from '@providers/development';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import urljoin from 'url-join';
import moment from 'moment';
import { RightOutlined, EditOutlined } from '@ant-design/icons';
import { searchableFields } from '@config/constants/allotment';
import { useLocation, Link } from 'react-router-dom';
import Title from './title';
import CreateAllotmentModal from './create-allotment-modal';
import EditAllotmentModal from './edit-allotment-modal';
import { Container, ActionsContainer } from './elements';
import { GET_ALLOTMENTS } from './requests';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Allotments = () => {
  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [blocks, setBlocks] = useState('');
  const [allotmentPrototypes, setAllotmentPrototypes] = useState('');
  const [allotmentEditId, setAllotmentEditId] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isOpenCreateAllotmentModal, toggleCreateAllotmentModal] = useState(false);

  const { development } = useDevelopment();
  const { pathname } = useLocation();

  const { data, loading, refetch } = useQuery(GET_ALLOTMENTS, {
    variables: {
      development: {
        eq: development.id,
      },
      params,
      search: searchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedSearch;
        return acc;
      }, {}),
      block:
        blocks.length > 0
          ? {
              in: blocks,
            }
          : undefined,
      allotmentPrototype:
        allotmentPrototypes.length > 0
          ? {
              in: allotmentPrototypes,
            }
          : undefined,
    },
  });

  const columns = [
    {
      title: 'Número',
      dataIndex: 'number',
      key: 'number',
      fixed: 'left',
    },
    {
      title: 'Manzana',
      dataIndex: 'block',
      key: 'block',
      render: ({ number }) => number,
    },
    {
      title: 'Prototipo',
      dataIndex: 'allotmentPrototype',
      key: 'allotmentPrototype',
      render: ({ name }) => name,
    },
    {
      title: 'Creado el',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => <Tag>{moment(createdAt).format('lll')}</Tag>,
    },
    {
      title: 'Última actualización',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt) => <Tag>{moment(updatedAt).format('lll')}</Tag>,
    },
    {
      title: 'Acciones',
      fixed: 'right',
      render: (allotment) => (
        <ActionsContainer>
          <Link to={urljoin(pathname, allotment.id)}>
            <Button type="primary" icon={<RightOutlined />} size="small">
              Ver
            </Button>
          </Link>
          <Tooltip onClick={() => setAllotmentEditId(allotment.id)} title="Editar lote">
            <Button style={{ marginLeft: 10 }} icon={<EditOutlined />} size="small" />
          </Tooltip>
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
            title={() => (
              <Title
                openCreateAllotmentModal={() => toggleCreateAllotmentModal(true)}
                setSearch={setSearch}
                setAllotmentPrototypes={setAllotmentPrototypes}
                setBlocks={setBlocks}
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
              total: data?.allotments.info.count,
              showTotal: (total) => `${total} lotes`,
              showSizeChanger: true,
              onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              style: { marginRight: 20 },
            }}
            dataSource={data?.allotments.results}
          />
        </Card>
      </Container>
      <CreateAllotmentModal
        visible={isOpenCreateAllotmentModal}
        onClose={() => toggleCreateAllotmentModal(false)}
        updateAllotments={refetch}
      />
      <EditAllotmentModal
        visible={!!allotmentEditId}
        allotmentEditId={allotmentEditId}
        onClose={() => setAllotmentEditId('')}
      />
    </>
  );
};

export default Allotments;
