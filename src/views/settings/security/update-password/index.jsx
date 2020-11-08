import React, { useState } from 'react';
import { passwordRegex } from '@config/constants';
import { LockOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Typography, Form, Input, Button, message } from 'antd';
import { UPDATE_PASSWORD } from './requests';

const { Title } = Typography;
const { Item } = Form;

const UpdatePassword = () => {
  const [updating, setUpdating] = useState(false);
  const [updatePassword] = useMutation(UPDATE_PASSWORD);
  const [form] = Form.useForm();

  const onFinish = async ({ oldPassword, newPassword }) => {
    setUpdating(true);

    const { errors } = await updatePassword({
      variables: {
        oldPassword,
        newPassword,
      },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      message.success('Tu contraseña fue actualizada correctamente');
      form.resetFields();
    }

    setUpdating(false);
  };

  return (
    <>
      <Title level={5}>Actualizar contraseña</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Item
          style={{ marginTop: 10 }}
          name="oldPassword"
          label="Contraseña anterior"
          rules={[{ required: true, message: 'Ingresa tu vieja contraseña' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Contraseña anterior" />
        </Item>
        <Item
          style={{ marginTop: 10 }}
          name="newPassword"
          label="Nueva contraseña"
          rules={[
            { required: true, message: 'Ingresa tu contraseña' },
            () => ({
              validator: (_, value) => {
                const validPasswordToSet = passwordRegex.test(value);

                if (validPasswordToSet) return Promise.resolve();

                return Promise.reject(
                  'La contraseña debe tener al menos 8 caractéres, con un número y un caractér especial'
                );
              },
            }),
          ]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Nueva contraseña" />
        </Item>
        <Item
          style={{ marginTop: 10 }}
          name="passwordConfirmation"
          label="Confirma tu nueva contraseña"
          rules={[
            { required: true, message: 'Confirma tu password' },
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                if (!value || getFieldValue('newPassword') === value) return Promise.resolve();

                return Promise.reject('Las dos contraseñas no coinciden');
              },
            }),
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Confirma tu nueva contraseña"
          />
        </Item>
        <Item style={{ marginTop: 20 }}>
          <Button
            loading={updating}
            style={{ display: 'block', marginLeft: 'auto' }}
            type="primary"
            htmlType="submit"
          >
            Actualizar
          </Button>
        </Item>
      </Form>
    </>
  );
};

export default UpdatePassword;
