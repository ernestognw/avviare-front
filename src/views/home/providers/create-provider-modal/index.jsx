import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation } from '@apollo/client';
import ProviderForm from '@components/provider-form';
import { CREATE_PROVIDER } from './requests';

const CreateProviderModal = ({ onClose, visible, updateProviders }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [createProvider] = useMutation(CREATE_PROVIDER);

  const onFinish = async (provider) => {
    setSaving(true);

    const { errors } = await createProvider({ variables: { provider } });
    if (errors) {
      message.error(errors[0].message);
    } else {
      await updateProviders();
      onClose();
      form.resetFields();
      message.success('El proveedor ha sido añadido correctamente');
    }

    setSaving(false);
  };

  return (
    <Drawer
      title="Crea un nuevo proveedor"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <ProviderForm form={form} onFinish={onFinish} loading={saving} />
    </Drawer>
  );
};

CreateProviderModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateProviders: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateProviderModal;
