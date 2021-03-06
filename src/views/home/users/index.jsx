import { useState, useMemo } from 'react';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';
import { Card, Table, Avatar, Tag, Button, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import useQueryParam from '@hooks/use-query-param';
import { overallRoles, searchableFields } from '@config/constants/user';
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
  const [params, setParams] = useQueryParam('params', defaultParams);
  const [search, setSearch] = useQueryParam('search', '');
  const [isOpenCreateUserModal, toggleCreateUserModal] = useState(false);
  const [userEditId, setUserEditId] = useState('');
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

  const { data, loading, refetch } = useQuery(GET_USERS, { variables });

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
      title: '??ltima actualizaci??n',
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
                search={search}
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
              current: Number(params.page),
              defaultCurrent: defaultParams.page,
              pageSize: Number(params.pageSize),
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
      <CreateUserModal
        visible={isOpenCreateUserModal}
        onClose={() => toggleCreateUserModal(false)}
        updateUsers={refetch}
      />
      <EditUserModal
        visible={!!userEditId}
        userEditId={userEditId}
        onClose={() => setUserEditId('')}
      />
    </>
  );
};

export default Users;
