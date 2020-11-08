import React, { useState } from 'react';
import { Typography, Form, Divider, message } from 'antd';
import { useMutation } from '@apollo/client';
import { useUser } from '@providers/user';
import UserForm from '@components/user-form';
import moment from 'moment';
import { UPDATE_USER } from './requests';

const { Title } = Typography;

const ProfileSettings = () => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateUser] = useMutation(UPDATE_USER);

  const { user, reloadUser, overallRole } = useUser();

  const onFinish = async (newUser) => {
    setSaving(true);
    const { errors } = await updateUser({
      variables: { user: newUser },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      await reloadUser();
      message.success('Tus datos han sido actualizados con éxito');
    }

    setSaving(false);
  };

  return (
    <>
      <Title level={4} style={{ marginBottom: 20 }}>
        Configuración de tu perfil
      </Title>
      <Divider />
      <UserForm
        form={form}
        onFinish={onFinish}
        saving={saving}
        disabled={{
          overallRole: !overallRole.admin,
          email: !overallRole.admin,
        }}
        layout="horizontal"
        initialValues={{
          ...user,
          dateOfBirth: moment(user.dateOfBirth),
        }}
      />
    </>
  );
};

export default ProfileSettings;
