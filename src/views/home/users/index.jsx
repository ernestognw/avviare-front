import React, { useState } from 'react';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { Card, Table, Avatar, Tag, Button, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { overallRoles } from '@config/constants';
import { Container, ActionsContainer } from './elements';
import { GET_USERS } from './requests';
import Title from './title';
import CreateUserModal from './create-user-modal';
import EditUserModal from './edit-user-modal';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Users = () => {
  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [isOpenCreateUserModal, toggleCreateUserModal] = useState(false);
  const [userEditId, setUserEditId] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const variables = {
    params,
    search: {
      username: debouncedSearch,
      firstName: debouncedSearch,
      lastName: debouncedSearch,
      email: debouncedSearch,
    },
  };

  const { data, loading, refetch } = useQuery(GET_USERS, { variables });

  const columns = [
    {
      title: '',
      dataIndex: 'profileImg',
      key: 'profileImg',
      render: (profileImg, { firstName }) => <Avatar src={profileImg}>{firstName[0]}</Avatar>,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
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
      title: 'Fecha de nacimiento',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (dateOfBirth) => moment(dateOfBirth).format('ll'),
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
          <Tooltip title="Editar usuario">
            <Button onClick={() => setUserEditId(id)} icon={<EditOutlined />} size="small" />
          </Tooltip>
        </ActionsContainer>
      ),
    },
  ];

  return (
    <>
      <Container>
        <Card style={{ width: '100%' }}>
          <Table
            loading={loading}
            columns={columns}
            title={() => (
              <Title
                openCreateUserModal={() => toggleCreateUserModal(true)}
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
              total: data?.users.info.count,
              showTotal: (total) => `${total} usuarios`,
              showSizeChanger: true,
              onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
            }}
            dataSource={data?.users.results}
          />
        </Card>
      </Container>
      <CreateUserModal
        visible={isOpenCreateUserModal}
        onClose={() => toggleCreateUserModal(false)}
        updateUsers={refetch}
      />
      <EditUserModal
        visible={!!userEditId}
        userEditId={userEditId}
        onClose={() => setUserEditId('')}
        updateUsers={refetch}
      />
    </>
  );
};

export default Users;
