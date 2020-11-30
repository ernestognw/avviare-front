import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { documentCategories } from '@config/constants/document';
import { developmentRoles } from '@config/constants/user';
import { FileDoneOutlined } from '@ant-design/icons';
import { Form, Input, Button, Select } from 'antd';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const DocumentForm = ({ onFinish, loading, form, initialValues, ...props }) => {
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
        label="Nombre del documento"
        name="name"
        rules={[{ required: true, message: 'Ingresa el nombre del document' }]}
      >
        <Input prefix={<FileDoneOutlined />} placeholder="Nombre" />
      </Item>
      <Item style={{ marginTop: 10 }} label="Descripción del documento" name="description">
        <TextArea placeholder="Descripe este documento..." rows={4} />
      </Item>
      <Item name="categories" label="Categorías del documento">
        <Select mode="multiple" allowClear placeholder="Categorías">
          {Object.keys(documentCategories).map((category) => (
            <Option key={category} value={category}>
              {documentCategories[category]}
            </Option>
          ))}
        </Select>
      </Item>
      <Item name="hiddenForRoles" label="Esconder a:">
        <Select mode="multiple" allowClear placeholder="Roles">
          {Object.keys(developmentRoles).map((role) => (
            <Option key={role} value={role}>
              {developmentRoles[role]}
            </Option>
          ))}
        </Select>
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

DocumentForm.defaultProps = {
  form: null,
  initialValues: null,
};

DocumentForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  form: PropTypes.object,
  initialValues: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default DocumentForm;
