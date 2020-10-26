import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Input, Button, Image, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authUrl } from '@config/environment';

const { Item } = Form;

const Login = () => {
  const [logging, setLogging] = useState(false);

  const onFinish = async (values) => {
    setLogging(true);
    try {
      await axios.post(
        `${authUrl}/login`,
        { ...values },
        {
          withCredentials: true,
        }
      );
      window.location.reload();
    } catch (err) {
      message.error('Cuenta no reconocida. Verifica tu correo y contraseña');
      setLogging(false);
    }
  };

  return (
    <Card style={{ maxWidth: 450, width: '100%' }}>
      <Image
        style={{ margin: '10px auto', display: 'block', marginBottom: 30 }}
        width={200}
        src="/images/brand/logo_black.png"
        alt="Logo"
      />
      <Form onFinish={onFinish}>
        <Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'Ingresa un correo válido',
            },
            { required: true, message: 'Ingresa tu email' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Item>
        <Item
          style={{ marginTop: 10 }}
          name="password"
          rules={[{ required: true, message: 'Ingresa tu password' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
        </Item>
        <Item style={{ marginTop: 20 }}>
          <Button loading={logging} block type="primary" htmlType="submit">
            Log in
          </Button>
        </Item>
      </Form>
    </Card>
  );
};

export default Login;
