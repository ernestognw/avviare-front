import React, { useState } from 'react';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { Card, Table, Avatar, Tag } from 'antd';
import { overallRoles } from '@config/constants';
import { Container } from './elements';
import { GET_USERS } from './requests';
import Title from './title';
import CreateUserModal from './create-user-modal';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Users = () => {
  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [isOpenCreateUserModal, toggleCreateUserModal] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const variables = {
    params,
    search: {
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
    </>
  );
};

export default Users;
