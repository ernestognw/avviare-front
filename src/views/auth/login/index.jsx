import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@providers/user';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import Box from '@components/box';
import { client } from '@utils/auth';

const { Item } = Form;

const Login = () => {
  const { setIsLogged } = useUser();
  const [logging, setLogging] = useState(false);

  const onFinish = async (values) => {
    setLogging(true);
    try {
      await client.post('/login', { ...values, expires: !values.remember });
      setIsLogged(true);
    } catch (err) {
      message.error('Cuenta no reconocida. Verifica tu correo y contraseña');
      setLogging(false);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Item
        name="emailUsername"
        rules={[{ required: true, message: 'Ingresa tu username o email' }]}
      >
        <Input size="large" prefix={<UserOutlined />} placeholder="Email o username" />
      </Item>
      <Item
        style={{ marginTop: 10 }}
        name="password"
        rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
      >
        <Input size="large" prefix={<LockOutlined />} type="password" placeholder="Contraseña" />
      </Item>
      <Box display="flex">
        <Item name="remember" valuePropName="checked" style={{ flexGrow: 1 }}>
          <Checkbox>Recuérdame</Checkbox>
        </Item>
        <Link to="/recover">
          <Button htmlType="button" style={{ padding: 0 }} type="link" block>
            Recuperar contraseña
          </Button>
        </Link>
      </Box>
      <Item>
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
  );
};

export default Login;
