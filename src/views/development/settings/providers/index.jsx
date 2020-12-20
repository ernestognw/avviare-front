import { useState, useMemo } from 'react';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { Card, Table, Tag } from 'antd';
import { searchableFields } from '@config/constants/provider';
import { useDevelopment } from '@providers/development';
import { Container } from './elements';
import { GET_PROVIDERS } from './requests';
import Title from './title';
import AddProviderModal from './add-provider-modal';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Providers = () => {
  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [isOpenAddProviderModal, toggleAddProviderModal] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const { development } = useDevelopment();

  const variables = {
    params,
    search: searchableFields.reduce((acc, curr) => {
      acc[curr] = debouncedSearch;
      return acc;
    }, {}),
    worksAt: {
      eq: development.id,
    },
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
      title: 'Trabaja desde el',
      dataIndex: 'worksAt',
      key: 'worksAt',
      render: ([{ addedAt }]) => <Tag>{moment(addedAt).format('lll')}</Tag>,
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
                openAddProviderModal={() => toggleAddProviderModal(true)}
                setSearch={setSearch}
              />
            )}
            size="small"
            scroll={{
              x: true,
            }}
            rowKey="id"
            pagination={{
              current: params.page,
              defaultCurrent: defaultParams.page,
              pageSize: params.pageSize,
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
      <AddProviderModal
        visible={isOpenAddProviderModal}
        onCancel={() => toggleAddProviderModal(false)}
        reloadProviders={refetch}
      />
    </>
  );
};

export default Providers;
