import { useState, useMemo } from 'react';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { Card, Table, Tag, Button, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { searchableFields } from '@config/constants/provider';
import { Container, ActionsContainer } from './elements';
import { GET_PROVIDERS } from './requests';
import Title from './title';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Providers = () => {
  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const variables = {
    params,
    search: searchableFields.reduce((acc, curr) => {
      acc[curr] = debouncedSearch;
      return acc;
    }, {}),
  };

  const { data, loading } = useQuery(GET_PROVIDERS, { variables });

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
      render: () => (
        <ActionsContainer>
          <Tooltip title="Editar proveedor">
            <Button icon={<EditOutlined />} size="small" />
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
          title={() => <Title setSearch={setSearch} />}
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
  );
};

export default Providers;
