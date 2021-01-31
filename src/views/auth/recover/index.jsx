import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Input, Button, Alert, message } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import { client } from '@utils/auth';

const { Item } = Form;

const Recover = () => {
  const [sending, setSending] = useState(false);

  const { push } = useHistory();

  const onFinish = async (values) => {
    setSending(true);
    try {
      await client.post('/recover', { ...values });
      message.info('Si tu correo es correcto, recibirás un correo con un link de recuperación');
      push('/login');
    } catch (err) {
      message.error(err.message);
      setSending(false);
    }
  };

  return (
    <>
      <Alert
        message="Ingresa tu correo, y si tienes una cuenta, te enviaremos un link de recuperación"
        type="info"
        showIcon
        style={{ marginBottom: 10 }}
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
        <Item style={{ marginTop: 20 }}>
          <Button
            icon={<LoginOutlined />}
            size="large"
            loading={sending}
            block
            type="primary"
            htmlType="submit"
          >
            Recuperar
          </Button>
        </Item>
        <Link to="/login">
          <Button type="link" block>
            Inicia sesión
          </Button>
        </Link>
      </Form>
    </>
  );
};

export default Recover;
