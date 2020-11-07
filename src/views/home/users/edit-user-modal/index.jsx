import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import moment from 'moment';
import { useMutation, useQuery } from '@apollo/client';
import UserForm from '@components/user-form';
import { UPDATE_USER, GET_USER } from './requests';

const EditUserModal = ({ onClose, userEditId, visible, updateUsers }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const formRef = useRef();
  const [updateUser] = useMutation(UPDATE_USER);
  const { loading, data } = useQuery(GET_USER, {
    variables: {
      id: userEditId,
    },
  });

  useEffect(() => {
    if (data?.user && formRef.current) {
      form.setFieldsValue({
        ...data.user,
        dateOfBirth: moment(data.user.dateOfBirth),
      });
    }
  }, [data, form]);

  const onFinish = async (user) => {
    setSaving(true);
    await updateUser({
      variables: { id: userEditId, user },
    });
    await updateUsers();
    onClose();
    message.success('Usuario actualizado con éxito');

    setSaving(false);
  };

  return (
    <Drawer
      title="Editar usuario"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <UserForm
        form={form}
        onFinish={onFinish}
        saving={saving}
        loadingUser={loading}
        ref={formRef}
      />
    </Drawer>
  );
};

EditUserModal.defaultProps = {
  userEditId: '',
};

EditUserModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  userEditId: PropTypes.string,
  updateUsers: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default EditUserModal;
