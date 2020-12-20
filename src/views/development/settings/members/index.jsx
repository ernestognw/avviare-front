import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';
import { Card, Table, Avatar, Button, Select, Tooltip, Modal, message } from 'antd';
import { useDevelopment } from '@providers/development';
import { overallRoles, developmentRoles, searchableFields } from '@config/constants/user';
import { CloseOutlined } from '@ant-design/icons';
import { Container, ActionsContainer } from './elements';
import { GET_MEMBERS, UPDATE_DEVELOPMENT_ROLE, REMOVE_USER_FROM_DEVELOPMENT } from './requests';
import Title from './title';
import AddUserModal from './add-user-modal';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const { Option } = Select;

const Members = () => {
  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [isOpenAddUserModal, toggleAddUserModal] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const { development, developmentRole } = useDevelopment();

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
  const { data, loading, refetch } = useQuery(GET_MEMBERS, { variables });
  const [updateDevelopmentRole] = useMutation(UPDATE_DEVELOPMENT_ROLE);
  const [removeUserFromDevelopment] = useMutation(REMOVE_USER_FROM_DEVELOPMENT);

  const updateRole = async (role, user) => {
    const { errors } = await updateDevelopmentRole({
      variables: {
        user,
        role,
        development: development.id,
      },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      await refetch();
      message.success('Rol actualizado');
    }
  };

  const removeUser = async (user) => {
    const { errors } = await removeUserFromDevelopment({
      variables: {
        user,
        development: development.id,
      },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      await refetch();
      message.success(`Usuario removido de ${development.name}`);
    }
  };

  const confirmRemoveUser = (id) =>
    Modal.confirm({
      title: `Remover usuario de ${development.name}`,
      content: 'Estás a punto de remover a este usuario del desarrollo',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => removeUser(id),
    });

  const columns = [
    {
      title: '',
      dataIndex: 'profileImg',
      key: 'profileImg',
      render: (profileImg, { firstName, username }) => (
        <Link to={`/@${username}`}>
          <Avatar style={{ marginLeft: 10 }} src={profileImg}>
            {firstName[0]}
          </Avatar>
        </Link>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (username) => (
        <Link to={`/@${username}`}>
          <Button size="small" type="link">
            {username}
          </Button>
        </Link>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Apellido',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol general',
      dataIndex: 'overallRole',
      key: 'overallRole',
      render: (overallRole) => overallRoles[overallRole],
    },
    {
      title: 'Rol en el desarrollo',
      dataIndex: 'worksAt',
      key: 'worksAt',
      render: (worksAt, { id }) => (
        <Select
          onSelect={(role) => updateRole(role, id)}
          size="small"
          disabled={!developmentRole.manager}
          value={worksAt[0].developmentRole}
        >
          {Object.keys(developmentRoles).map((role) => (
            <Option key={role} value={role}>
              {developmentRoles[role]}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Acciones',
      // eslint-disable-next-line react/prop-types
      render: ({ id }) => (
        <ActionsContainer>
          <Tooltip title="Remover">
            <Button
              onClick={() => confirmRemoveUser(id)}
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

  return (
    <>
      <Container>
        <Card style={{ width: '100%', padding: 0 }}>
          <Table
            loading={loading}
            columns={columns}
            title={() => (
              <Title openCreateUserModal={() => toggleAddUserModal(true)} setSearch={setSearch} />
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
              total: data?.users.info.count,
              showTotal: (total) => `${total} usuarios`,
              showSizeChanger: true,
              onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              style: {
                marginRight: 20,
              },
            }}
            dataSource={data?.users.results}
          />
        </Card>
      </Container>
      <AddUserModal
        visible={isOpenAddUserModal}
        onCancel={() => toggleAddUserModal(false)}
        reloadUsers={refetch}
      />
    </>
  );
};

export default Members;
