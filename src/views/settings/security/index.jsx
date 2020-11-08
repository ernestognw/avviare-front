import React from 'react';
import { Typography, Divider } from 'antd';
import UpdatePassword from './update-password';

const { Title } = Typography;

const Security = () => {
  return (
    <>
      <Title level={4} style={{ marginBottom: 20 }}>
        Configuración de seguridad
      </Title>
      <Divider />
      <UpdatePassword />
    </>
  );
};

export default Security;
