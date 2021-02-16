import { useState, useMemo } from 'react';
import moment from 'moment';
import { useQuery, useMutation } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import useQueryParam from '@hooks/use-query-param';
import { Card, Table, Tag, Tooltip, Button, Modal, message } from 'antd';
import { searchableFields } from '@config/constants/provider';
import { useDevelopment } from '@providers/development';
import { CloseOutlined } from '@ant-design/icons';
import { Container, ActionsContainer } from './elements';
import { GET_PROVIDERS, REMOVE_PROVIDER_FROM_DEVELOPMENT } from './requests';
import Title from './title';
import AddProviderModal from './add-provider-modal';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Providers = () => {
  const [params, setParams] = useQueryParam('params', defaultParams);
  const [search, setSearch] = useQueryParam('search', '');
  const [isOpenAddProviderModal, toggleAddProviderModal] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const { development, developmentRole } = useDevelopment();

  const variables = {
    params: {
      page: Number(params.page),
      pageSize: Number(params.pageSize),
    },
    search: searchableFields.reduce((acc, curr) => {
      acc[curr] = debouncedSearch;
      return acc;
    }, {}),
    worksAt: {
      eq: development.id,
    },
  };

  const { data, loading, refetch } = useQuery(GET_PROVIDERS, { variables });
  const [removeProviderFromDevelopment] = useMutation(REMOVE_PROVIDER_FROM_DEVELOPMENT);

  const removeProvider = async (provider) => {
    const { errors } = await removeProviderFromDevelopment({
      variables: {
        provider,
        development: development.id,
      },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      await refetch();
      message.success(`Proveedor removido de ${development.name}`);
    }
  };

  const confirmRemoveProvider = (id) =>
    Modal.confirm({
      title: `Remover proveedor de ${development.name}`,
      content:
        'Estás a punto de remover a este proveedor del desarrollo. Esto significa que no aparecerá como una opción para adjudicar avances de subconcepto. Los subconceptos ya adjudicados anteriormente permanecerán intactos',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => removeProvider(id),
    });

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
    {
      title: 'Acciones',
      // eslint-disable-next-line react/prop-types
      render: ({ id }) => (
        <ActionsContainer>
          <Tooltip title="Remover">
            <Button
              onClick={() => confirmRemoveProvider(id)}
              icon={<CloseOutlined />}
              disabled={!developmentRole.manager}
              type="danger"
              size="small"
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
      <AddProviderModal
        visible={isOpenAddProviderModal}
        onCancel={() => toggleAddProviderModal(false)}
        reloadProviders={refetch}
      />
    </>
  );
};

export default Providers;
