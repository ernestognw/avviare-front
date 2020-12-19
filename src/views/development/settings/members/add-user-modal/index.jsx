import { useState } from 'react';
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
  const [params] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { development } = useDevelopment();
  const [form] = Form.useForm();

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
      worksAt: {
        ne: development.id,
      },
    },
    skip: !visible,
  });

  const addUser = async ({ user, role }) => {
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
      setSearch('');
      form.resetFields();
    }

    setAdding(false);
  };

  return (
    <Modal
      title={`Agrega a un usuario a ${development.name}`}
      visible={visible}
      onOk={form.submit}
      onCancel={onCancel}
      confirmLoading={adding}
    >
      <Form layout="vertical" form={form} onFinish={addUser}>
        <Item
          label="Selecciona un usuario"
          name="user"
          rules={[{ required: true, message: 'Ingresa el usuario' }]}
        >
          <Select
            allowClear
            placeholder="Selecciona un usuario"
            onClear={() => setSearch('')}
            loading={loading}
            onSearch={setSearch}
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
        <Item
          label="Rol en el desarrollo"
          name="role"
          rules={[{ required: true, message: 'Ingresa el rol del usuario' }]}
        >
          <Select placeholder="Rol en el desarrollo">
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
