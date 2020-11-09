import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import PropTypes from 'prop-types';
import { developmentRoles } from '@config/constants/user';
import { Modal, Form, Select, Typography, message } from 'antd';
import { useDevelopment } from '@providers/development';
import { ADD_USER_TO_DEVELOPMENT, SEARCH_USERS } from './requests';

const { Item } = Form;
const { Option } = Select;
const { Text } = Typography;

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const AddUserModal = ({ visible, onCancel, reloadUsers }) => {
  const [user, setUser] = useState('');
  const [role, setRole] = useState('');
  const [params] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { development } = useDevelopment();

  const [addUserToDevelopment] = useMutation(ADD_USER_TO_DEVELOPMENT);

  const { data, loading } = useQuery(SEARCH_USERS, {
    variables: {
      params,
      search: {
        username: debouncedSearch,
        firstName: debouncedSearch,
        lastName: debouncedSearch,
        email: debouncedSearch,
      },
      development: {
        nin: [development.id],
      },
    },
  });

  const addUser = async () => {
    if (!user) {
      message.warning('Necesitas seleccionar a un usuario');
      return;
    }

    if (!role) {
      message.warning('Necesitas añadir un rol');
      return;
    }

    setAdding(true);
    const { errors } = await addUserToDevelopment({
      variables: { user, development: development.id, role },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      message.success('El usuario ha sido añadido correctamente al desarrollo');
      await reloadUsers();
      onCancel();
      return;
    }

    setAdding(true);
  };

  return (
    <Modal
      title={`Agrega a un usuario a ${development.name}`}
      visible={visible}
      onOk={addUser}
      onCancel={onCancel}
      confirmLoading={adding}
    >
      <Form>
        <Item>
          <Select
            value={search}
            placeholder="Selecciona un usuario"
            loading={loading}
            onSearch={setSearch}
            onSelect={(value) => {
              setSearch(value);
              setUser(value);
            }}
            filterOption={false}
            showSearch
          >
            {data?.users.results.map(({ id, firstName, lastName, email }) => (
              <Option key={id} value={id}>
                <Text strong>
                  {firstName} {lastName}
                </Text>
                <br />
                <Text>{email}</Text>
              </Option>
            ))}
          </Select>
        </Item>
        <Item>
          <Select placeholder="Rol en el desarrollo" onSelect={setRole}>
            {Object.keys(developmentRoles).map((developmentRole) => (
              <Option key={developmentRole} value={developmentRole}>
                {developmentRoles[developmentRole]}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
};

AddUserModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  reloadUsers: PropTypes.func.isRequired,
};

export default AddUserModal;
