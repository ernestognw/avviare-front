import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation } from '@apollo/client';
import UserForm from '@components/user-form';
import { CREATE_USER } from './requests';

const CreateUserModal = ({ onClose, visible, updateUsers }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [createUser] = useMutation(CREATE_USER);

  const onFinish = async (user) => {
    setSaving(true);

    await createUser({ variables: { user } });
    await updateUsers();
    onClose();
    form.resetFields();
    message.success('El usuario recibirá sus instrucciones de acceso en su correo');

    setSaving(false);
  };

  return (
    <Drawer
      title="Crea un nuevo usuario"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <UserForm
        form={form}
        initialValues={{ overallRole: 'USER' }}
        onFinish={onFinish}
        saving={saving}
      />
    </Drawer>
  );
};

CreateUserModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateUsers: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateUserModal;
