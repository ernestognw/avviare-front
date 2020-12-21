import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import PropTypes from 'prop-types';
import { searchableFields } from '@config/constants/provider';
import { Modal, Form, Select, Typography, Alert, message } from 'antd';
import { useDevelopment } from '@providers/development';
import { ADD_PROVIDER_TO_DEVELOPMENT, SEARCH_PROVIDERS } from './requests';

const { Item } = Form;
const { Option } = Select;
const { Text } = Typography;

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const AddProviderModal = ({ visible, onCancel, reloadProviders }) => {
  const [params] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { development } = useDevelopment();
  const [form] = Form.useForm();

  const [addProviderToDevelopment] = useMutation(ADD_PROVIDER_TO_DEVELOPMENT);

  const { data, loading } = useQuery(SEARCH_PROVIDERS, {
    variables: {
      params,
      search: searchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedSearch;
        return acc;
      }, {}),
      worksAt: {
        ne: development.id,
      },
    },
    skip: !visible,
  });

  const addUser = async ({ provider, role }) => {
    setAdding(true);
    const { errors } = await addProviderToDevelopment({
      variables: { provider, development: development.id, role },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      message.success('El proveedor ha sido añadido correctamente al desarrollo');
      await reloadProviders();
      onCancel();
      setSearch('');
      form.resetFields();
    }

    setAdding(false);
  };

  return (
    <Modal
      title={`Agrega a un proveedor a ${development.name}`}
      visible={visible}
      onOk={form.submit}
      onCancel={onCancel}
      confirmLoading={adding}
    >
      <Alert
        message="¿Qué hacer si no aparece el proveedor?"
        description="Si el proveedor no aparece, es necesario que un administrador lo registre en la plataforma para que pueda ser añadido a los desarrollos"
        type="info"
        showIcon
        style={{ marginBottom: 10 }}
      />
      <Form layout="vertical" form={form} onFinish={addUser}>
        <Item
          label="Selecciona un proveedor"
          name="provider"
          rules={[{ required: true, message: 'Ingresa el proveedor' }]}
        >
          <Select
            allowClear
            placeholder="Selecciona un proveedor"
            onClear={() => setSearch('')}
            loading={loading}
            onSearch={setSearch}
            filterOption={false}
            showSearch
          >
            {data?.providers.results.map(({ id, businessName, RFC }) => (
              <Option key={id} value={id}>
                <Text strong>{businessName}</Text>
                <br />
                <Text>{RFC}</Text>
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
};

AddProviderModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  reloadProviders: PropTypes.func.isRequired,
};

export default AddProviderModal;
