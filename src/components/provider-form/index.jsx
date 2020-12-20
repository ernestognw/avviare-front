import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';
import {
  ShopOutlined,
  BarcodeOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Form, Input, Button, InputNumber, message } from 'antd';
import validateRFC from 'validate-rfc';
import { RFC_EXISTS } from './requests';

const { Item } = Form;

const UserForm = ({ onFinish, loading, form, initialValues, ...props }) => {
  const { query } = useApolloClient();

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const checkRFC = async (RFC) => {
    if (RFC === initialValues?.RFC) return false;
    const {
      data: { providerRFCExists },
    } = await query({
      query: RFC_EXISTS,
      variables: {
        RFC,
      },
      fetchPolicy: 'network-only',
    });

    return providerRFCExists;
  };

  const handleOnFinish = async (values) => {
    const RFCExists = await checkRFC(values.RFC);

    if (RFCExists)
      message.warning('El RFC que estás intentando registrar ya le pertenece a otro proveedor');
    else await onFinish({ ...values });
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleOnFinish}
      form={form}
      initialValues={initialValues}
      {...props}
    >
      <Item
        style={{ marginTop: 10 }}
        label="Razón social"
        name="businessName"
        rules={[{ required: true, message: 'Ingresa la razón social del proveedor' }]}
      >
        <Input prefix={<ShopOutlined />} placeholder="Razón Social" />
      </Item>
      <Item
        style={{ marginTop: 10 }}
        label="RFC"
        name="RFC"
        rules={[
          { required: true, message: 'Ingresa el RFC del proveedor' },
          {
            validator: (_, RFC) => {
              const { isValid, errors } = validateRFC(RFC);

              if (isValid) return Promise.resolve();

              if (errors[0] === 'INVALID_DATE')
                return Promise.reject('Los dígitos del RFC generan una fecha inválida');

              if (errors[0] === 'INVALID_VERIFICATION_DIGIT')
                return Promise.reject('El digito verificador de la homoclave es incorrecto');

              return Promise.reject('El formato del RFC es incorrecto');
            },
          },
        ]}
      >
        <Input prefix={<BarcodeOutlined />} placeholder="RFC" />
      </Item>
      <Item
        style={{ marginTop: 10 }}
        label="Nombre del contacto"
        name="contactFirstName"
        rules={[{ required: true, message: 'Ingresa el nombre del contacto' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Nombre (s)" />
      </Item>
      <Item
        style={{ marginTop: 10 }}
        label="Apellido del contacto"
        name="contactLastName"
        rules={[{ required: true, message: 'Ingresa el apellido del contacto' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Apellido (s)" />
      </Item>
      <Item
        label="Correo del contacto"
        name="contactEmail"
        rules={[
          {
            type: 'email',
            message: 'Ingresa un correo válido',
          },
          { required: true, message: 'Ingresa el correo del contacto' },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Correo del contacto" />
      </Item>
      <Item
        label="Teléfono del contacto"
        name="contactPhone"
        rules={[{ required: true, message: 'Ingresa el teléfono del contacto' }]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="Teléfono del contacto" />
      </Item>
      <Item
        label="Días de crédito"
        name="creditDays"
        rules={[{ required: true, message: 'Ingresa los días de crédito del proveedor' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Días de crédito" />
      </Item>
      <Item style={{ marginTop: 20 }}>
        <Button
          loading={loading}
          style={{ display: 'block', marginLeft: 'auto' }}
          type="primary"
          htmlType="submit"
        >
          Guardar
        </Button>
      </Item>
    </Form>
  );
};

UserForm.defaultProps = {
  form: null,
  initialValues: null,
};

UserForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  form: PropTypes.object,
  initialValues: PropTypes.shape({
    businessName: PropTypes.string,
    RFC: PropTypes.string,
    contactFirstName: PropTypes.string,
    contactLastName: PropTypes.string,
    contactEmail: PropTypes.string,
    contactPhone: PropTypes.string,
    creditDays: PropTypes.number,
  }),
};

export default UserForm;
