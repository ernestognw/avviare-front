import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useMutation, useQuery } from '@apollo/client';
import UserForm from '@components/user-form';
import { UPDATE_USER, GET_USER } from './requests';

const EditUserModal = ({ onClose, userEditId, visible, updateUsers }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateUser] = useMutation(UPDATE_USER);
  const { loading, data } = useQuery(GET_USER, {
    variables: {
      id: userEditId,
    },
  });

  useEffect(() => {
    if (data?.user) {
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
      {loading ? (
        <div
          style={{
            display: 'flex',
            margin: 40,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <UserForm
          form={form}
          initialValues={{ overallRole: 'USER' }}
          onFinish={onFinish}
          loading={saving}
        />
      )}
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
