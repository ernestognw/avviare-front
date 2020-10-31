import React, { useState } from 'react';
import moment from 'moment';
import { useTitle } from '@providers/layout';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { Card, Table, Avatar } from 'antd';
import { Container } from './elements';
import { GET_USERS } from './requests';
import Title from './title';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Users = () => {
  useTitle('Usuarios');
  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const variables = {
    params,
    search: {
      firstName: debouncedSearch,
      lastName: debouncedSearch,
      email: debouncedSearch,
    },
  };

  const { data, loading } = useQuery(GET_USERS, { variables });

  const columns = [
    {
      title: '',
      dataIndex: 'profileImg',
      key: 'profileImg',
      render: (profileImg) => <Avatar src={profileImg} />,
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
      render: (dateOfBirth) => moment(dateOfBirth).format('lll'),
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
    },
    {
      title: 'Creado el',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('lll'),
    },
    {
      title: 'Última actualización',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt) => moment(updatedAt).format('lll'),
    },
  ];

  return (
    <Container>
      <Card style={{ width: '100%' }}>
        <Table
          loading={loading}
          columns={columns}
          title={() => <Title setSearch={setSearch} />}
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
  );
};

export default Users;
