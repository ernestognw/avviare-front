import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FileDoneOutlined, NumberOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';

const { Item } = Form;
const { TextArea } = Input;

const ConceptForm = ({ onFinish, loading, form, initialValues, ...props }) => {
  useEffect(() => {
    form.resetFields();
  }, [form]);

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      initialValues={initialValues}
      {...props}
    >
      <Item
        label="Nombre"
        name="name"
        rules={[{ required: true, message: 'Ingresa el nombre del concepto' }]}
      >
        <Input prefix={<FileDoneOutlined />} placeholder="Nombre" />
      </Item>
      <Item
        label="Código"
        name="code"
        rules={[
          { required: true, message: 'Ingresa el código identificador del concepto' },
          {
            validator: (_, value) => (!value.includes(' ') ? Promise.resolve() : Promise.reject()),
            message: 'El código no puede tener espacios',
          },
        ]}
      >
        <Input prefix={<NumberOutlined />} placeholder="Número" />
      </Item>
      <Item label="Descripción" name="description">
        <TextArea placeholder="Añade información extra sobre el concepto" rows={4} />
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

ConceptForm.defaultProps = {
  form: null,
  initialValues: null,
};

ConceptForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  form: PropTypes.object,
  initialValues: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default ConceptForm;
