import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FileDoneOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';

const { Item } = Form;

const AllotmentPrototypeForm = ({ onFinish, loading, form, initialValues, ...props }) => {
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
        style={{ marginTop: 10 }}
        label="Nombre del prototipo"
        name="name"
        rules={[{ required: true, message: 'Ingresa el nombre del prototipo' }]}
      >
        <Input prefix={<FileDoneOutlined />} placeholder="Nombre" />
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

AllotmentPrototypeForm.defaultProps = {
  form: null,
  initialValues: null,
};

AllotmentPrototypeForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  form: PropTypes.object,
  initialValues: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default AllotmentPrototypeForm;
