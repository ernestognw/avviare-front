import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';
import { Card, Table, Avatar, Button, Select, message } from 'antd';
import { useDevelopment } from '@providers/development';
import { overallRoles, developmentRoles } from '@config/constants/user';
import { Container } from './elements';
import { GET_MEMBERS, UPDATE_DEVELOPMENT_ROLE } from './requests';
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

  const { development } = useDevelopment();

  const variables = {
    params,
    search: {
      username: debouncedSearch,
      firstName: debouncedSearch,
      lastName: debouncedSearch,
      email: debouncedSearch,
    },
    development: {
      in: [development.id],
    },
  };
  const { data, loading, refetch } = useQuery(GET_MEMBERS, { variables });
  const [updateDevelopmentRole] = useMutation(UPDATE_DEVELOPMENT_ROLE);

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
          value={worksAt[0].developmentRole}
        >
          {Object.keys(developmentRoles).map((developmentRole) => (
            <Option key={developmentRole} value={developmentRole}>
              {developmentRoles[developmentRole]}
            </Option>
          ))}
        </Select>
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
