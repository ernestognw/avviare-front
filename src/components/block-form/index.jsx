import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { NumberOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';

const { Item } = Form;

const BlockForm = ({ onFinish, loading, form, initialValues, ...props }) => {
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
        label="Número de la manzana"
        name="number"
        rules={[{ required: true, message: 'Ingresa el número de la manzana' }]}
      >
        <Input prefix={<NumberOutlined />} placeholder="Nombre" />
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

BlockForm.defaultProps = {
  form: null,
  initialValues: null,
};

BlockForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  form: PropTypes.object,
  initialValues: PropTypes.shape({
    number: PropTypes.string,
  }),
};

export default BlockForm;
