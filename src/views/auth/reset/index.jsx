import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Input, Button, Alert, Spin, message } from 'antd';
import { passwordRegex } from '@config/constants';
import { LockOutlined, LoginOutlined, LoadingOutlined } from '@ant-design/icons';
import { authUrl } from '@config/environment';

const { Item } = Form;

const Reset = () => {
  const [sending, setSending] = useState(false);
  const [token, setToken] = useState('');
  const { search } = useLocation();
  const { push } = useHistory();

  const onFinish = async ({ password }) => {
    setSending(true);

    try {
      await axios.post(`${authUrl}/reset`, { passwordRecoveryToken: token, password });
      message.info('Tu contraseña ha sido reseteada correctamente. Intenta acceder con ella');
      push('/login');
    } catch (err) {
      message.error(err.message);
      setSending(false);
    }
  };

  useEffect(() => {
    const validate = async () => {
      const searchParams = new URLSearchParams(search);
      const passwordRecoveryToken = searchParams.get('token');

      if (!passwordRecoveryToken) {
        push('/login');
        return;
      }

      try {
        await axios.post(`${authUrl}/validate`, { passwordRecoveryToken });
        setToken(passwordRecoveryToken);
      } catch (err) {
        push('/recover');
        message.error(
          'Token inválido o expirado, solicita de nuevo una recuperación de contraseña e inténtalo otra vez'
        );
      }
    };

    validate();
  }, [push, search]);

  if (!token)
    return (
      <div
        style={{
          display: 'flex',
          margin: 40,
          justifyContent: 'center',
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );

  return (
    <>
      <Alert
        message="Crea una nueva contraseña"
        description="Añade la nueva contraseña que utlizarás"
        type="info"
        showIcon
        style={{ marginBottom: 10 }}
      />
      <Form onFinish={onFinish}>
        <Item
          style={{ marginTop: 10 }}
          name="password"
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
          <Input size="large" prefix={<LockOutlined />} type="password" placeholder="Contraseña" />
        </Item>
        <Item
          style={{ marginTop: 10 }}
          name="passwordConfirmation"
          rules={[
            { required: true, message: 'Confirma tu password' },
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                if (!value || getFieldValue('password') === value) return Promise.resolve();

                return Promise.reject('Las dos contraseñas no coinciden');
              },
            }),
          ]}
        >
          <Input
            size="large"
            prefix={<LockOutlined />}
            type="password"
            placeholder="Confirmacción de contraseña"
          />
        </Item>
        <Item style={{ marginTop: 20 }}>
          <Button
            icon={<LoginOutlined />}
            size="large"
            loading={sending}
            block
            type="primary"
            htmlType="submit"
          >
            Guardar contraseña
          </Button>
        </Item>
      </Form>
    </>
  );
};

export default Reset;
