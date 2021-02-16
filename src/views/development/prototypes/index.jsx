import { useState } from 'react';
import { Card, Table, Tooltip, Button, Tag, Progress } from 'antd';
import { useDevelopment } from '@providers/development';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import urljoin from 'url-join';
import useQueryParam from '@hooks/use-query-param';
import moment from 'moment';
import { RightOutlined, EditOutlined } from '@ant-design/icons';
import { searchableFields } from '@config/constants/allotment-prototype';
import { useLocation, Link } from 'react-router-dom';
import Title from './title';
import CreateAllotmentPrototypeModal from './create-allotment-prototype-modal';
import EditAllotmentPrototypeModal from './edit-allotment-prototype-modal';
import { Container, ActionsContainer } from './elements';
import { GET_PROTOTYPES } from './requests';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Prototypes = () => {
  const [params, setParams] = useQueryParam('params', defaultParams);
  const [search, setSearch] = useQueryParam('search', '');
  const [allotmentPrototypeEditId, setAllotmentPrototypeEditId] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isOpenCreateAllotmentPrototypeModal, toggleCreateAllotmentPrototypeModal] = useState(
    false
  );

  const { development, developmentRole } = useDevelopment();
  const { pathname } = useLocation();

  const { data, loading, refetch } = useQuery(GET_PROTOTYPES, {
    variables: {
      development: {
        eq: development.id,
      },
      params: {
        page: Number(params.page),
        pageSize: Number(params.pageSize),
      },
      search: searchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedSearch;
        return acc;
      }, {}),
    },
  });

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
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
      title: 'Progreso',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => <Progress size="small" percent={progress} />,
    },
    {
      title: 'Acciones',
      fixed: 'right',
      render: (allotmentPrototype) => (
        <ActionsContainer>
          <Link to={urljoin(pathname, allotmentPrototype.id)}>
            <Button type="primary" icon={<RightOutlined />} size="small">
              Ver
            </Button>
          </Link>
          <Tooltip
            onClick={() => setAllotmentPrototypeEditId(allotmentPrototype.id)}
            title="Editar prototipo"
          >
            <Button
              disabled={!developmentRole.manager}
              style={{ marginLeft: 10 }}
              icon={<EditOutlined />}
              size="small"
            />
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
                openCreateAllotmentPrototypeModal={() => toggleCreateAllotmentPrototypeModal(true)}
                search={search}
                setSearch={setSearch}
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
              total: data?.allotmentPrototypes.info.count,
              showTotal: (total) => `${total} prototipos`,
              showSizeChanger: true,
              onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              style: { marginRight: 20 },
            }}
            dataSource={data?.allotmentPrototypes.results}
          />
        </Card>
      </Container>
      <CreateAllotmentPrototypeModal
        visible={isOpenCreateAllotmentPrototypeModal}
        onClose={() => toggleCreateAllotmentPrototypeModal(false)}
        updateAllotmentPrototypes={refetch}
      />
      <EditAllotmentPrototypeModal
        visible={!!allotmentPrototypeEditId}
        allotmentPrototypeEditId={allotmentPrototypeEditId}
        onClose={() => setAllotmentPrototypeEditId('')}
      />
    </>
  );
};

export default Prototypes;
