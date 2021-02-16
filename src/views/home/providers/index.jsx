import { useState, useMemo } from 'react';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import useQueryParam from '@hooks/use-query-param';
import { Card, Table, Tag, Button, Tooltip, Avatar } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { searchableFields } from '@config/constants/provider';
import theme from '@config/theme';
import { Container, ActionsContainer } from './elements';
import { GET_PROVIDERS } from './requests';
import Title from './title';
import CreateProviderModal from './create-provider-modal';
import EditProviderModal from './edit-provider-modal';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Providers = () => {
  const [params, setParams] = useQueryParam('params', defaultParams);
  const [search, setSearch] = useQueryParam('search', '');
  const [providerEditId, setProviderEditId] = useState('');
  const [isOpenCreateProviderModal, toggleCreateProviderModal] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const variables = {
    params: {
      page: Number(params.page),
      pageSize: Number(params.pageSize),
    },
    search: searchableFields.reduce((acc, curr) => {
      acc[curr] = debouncedSearch;
      return acc;
    }, {}),
  };

  const { data, loading, refetch } = useQuery(GET_PROVIDERS, { variables });

  const columns = [
    {
      title: 'Razón social',
      dataIndex: 'businessName',
      key: 'businessName',
    },
    {
      title: 'RFC',
      dataIndex: 'RFC',
      key: 'RFC',
    },
    {
      title: 'Trabaja en',
      dataIndex: 'worksAt',
      key: 'worksAt',
      render: (worksAt) => (
        <Avatar.Group maxCount={5} maxStyle={{ backgroundColor: theme.colors.primary }}>
          {worksAt.map(({ development: { id: developmentId, name, logo } }) => (
            <Tooltip key={developmentId} title={name} placement="top">
              <Avatar src={logo} />
            </Tooltip>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'Nombre de Contacto',
      dataIndex: 'contactFirstName',
      key: 'contactFirstName',
    },
    {
      title: 'Apellido de Contacto',
      dataIndex: 'contactLastName',
      key: 'contactLastName',
    },
    {
      title: 'Correo de Contacto',
      dataIndex: 'contactEmail',
      key: 'contactEmail',
    },
    {
      title: 'Teléfono de Contacto',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: 'Días de crédito',
      dataIndex: 'creditDays',
      key: 'creditDays',
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
      // eslint-disable-next-line react/prop-types
      render: ({ id }) => (
        <ActionsContainer>
          <Tooltip title="Editar proveedor">
            <Button onClick={() => setProviderEditId(id)} icon={<EditOutlined />} size="small" />
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
                openCreateProviderModal={() => toggleCreateProviderModal(true)}
                setSearch={setSearch}
              />
            )}
            size="small"
            scroll={{
              x: true,
            }}
            rowKey="id"
            pagination={{
              current: Number(params.page),
              defaultCurrent: defaultParams.page,
              pageSize: Number(params.pageSize),
              defaultPageSize: defaultParams.pageSize,
              total: data?.providers.info.count,
              showTotal: (total) => `${total} proveedores`,
              showSizeChanger: true,
              onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              style: {
                marginRight: 20,
              },
            }}
            dataSource={data?.providers.results}
          />
        </Card>
      </Container>
      <CreateProviderModal
        visible={isOpenCreateProviderModal}
        onClose={() => toggleCreateProviderModal(false)}
        updateProviders={refetch}
      />
      <EditProviderModal
        visible={!!providerEditId}
        providerEditId={providerEditId}
        onClose={() => setProviderEditId('')}
      />
    </>
  );
};

export default Providers;
