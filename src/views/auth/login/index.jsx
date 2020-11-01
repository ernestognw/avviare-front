import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
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
    <div style={{ maxWidth: 400, width: '100%' }}>
      <img
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
          <Input size="large" prefix={<UserOutlined />} placeholder="Email" />
        </Item>
        <Item
          style={{ marginTop: 10 }}
          name="password"
          rules={[{ required: true, message: 'Ingresa tu password' }]}
        >
          <Input size="large" prefix={<LockOutlined />} type="password" placeholder="Password" />
        </Item>
        <Item style={{ marginTop: 20 }}>
          <Button
            icon={<LoginOutlined />}
            size="large"
            loading={logging}
            block
            type="primary"
            htmlType="submit"
          >
            Log in
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default Login;
