import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
        rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
      >
        <Input size="large" prefix={<LockOutlined />} type="password" placeholder="Contraseña" />
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
      <Link to="/recover">
        <Button type="link" block>
          ¿Olvidaste tu contraseña?
        </Button>
      </Link>
    </Form>
  );
};

export default Login;
