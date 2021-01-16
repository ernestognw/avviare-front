import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FileDoneOutlined, NumberOutlined } from '@ant-design/icons';
import { units } from '@config/constants/subconcept';
import { Form, Input, Button, InputNumber, Select } from 'antd';

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

const SubconceptForm = ({ onFinish, loading, form, initialValues, ...props }) => {
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
        rules={[{ required: true, message: 'Ingresa el nombre del subconcepto' }]}
      >
        <Input prefix={<FileDoneOutlined />} placeholder="Nombre" />
      </Item>
      <Item
        label="Código"
        name="code"
        rules={[
          { required: true, message: 'Ingresa el código identificador del subconcepto' },
          {
            validator: (_, value) => (!value?.includes(' ') ? Promise.resolve() : Promise.reject()),
            message: 'El código no puede tener espacios',
          },
        ]}
      >
        <Input prefix={<NumberOutlined />} placeholder="Código" />
      </Item>
      <Item
        label="Cantidad"
        name="quantity"
        rules={[{ required: true, message: 'Ingresa la cantidad del subconcepto' }]}
      >
        <InputNumber min={0} step={0.01} precision={2} />
      </Item>
      <Item
        label="Unidad"
        name="unit"
        rules={[{ required: true, message: 'Ingresa la unidad del subconcepto' }]}
      >
        <Select placeholder="Unidad">
          {Object.keys(units).map((unit) => (
            <Option key={unit} value={unit}>
              {units[unit]}
            </Option>
          ))}
        </Select>
      </Item>
      <Item
        label="Precio por unidad"
        name="unitPrice"
        rules={[{ required: true, message: 'Ingresa el precio por unidad' }]}
      >
        <InputNumber formatter={(value) => `$${value}`} min={0} step={0.01} precision={2} />
      </Item>
      <Item label="Descripción" name="description">
        <TextArea placeholder="Añade información extra sobre el subconcepto" rows={4} />
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

SubconceptForm.defaultProps = {
  form: null,
  initialValues: null,
};

SubconceptForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  form: PropTypes.object,
  initialValues: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number,
    unit: PropTypes.oneOf(Object.keys(units)),
    unitPrice: PropTypes.number,
  }),
};

export default SubconceptForm;
