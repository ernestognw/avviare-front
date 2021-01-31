import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImgCrop from 'antd-img-crop';
import { overallRoles } from '@config/constants/user';
import { validateImageTypes } from '@utils/files';
import { useApolloClient } from '@apollo/client';
import moment from 'moment';
import useUpload from '@hooks/use-upload';
import { UserOutlined, LoadingOutlined, PlusOutlined, MailOutlined } from '@ant-design/icons';
import { Form, Input, DatePicker, Button, Select, Avatar, Upload, message } from 'antd';
import { EMAIL_EXISTS, USERNAME_EXISTS } from './requests';

const { Item } = Form;
const { Option } = Select;

const UserForm = ({ onFinish, loading, form, disabled, initialValues, ...props }) => {
  const { upload, uploading } = useUpload();
  const [imageUrl, setImageUrl] = useState(initialValues?.profileImg || '');
  const { query } = useApolloClient();

  const handleUpload = async ({ file }) => {
    const url = await upload(file, file.name);
    setImageUrl(url);
  };

  useEffect(() => {
    form.resetFields();
  }, [form]);

  const checkEmail = async (email) => {
    if (email === initialValues?.email) return false;
    const {
      data: { userEmailExists },
    } = await query({
      query: EMAIL_EXISTS,
      variables: {
        email,
      },
      fetchPolicy: 'network-only',
    });

    return userEmailExists;
  };

  const checkUsername = async (username) => {
    if (username === initialValues?.username) return false;
    const {
      data: { usernameExists },
    } = await query({
      query: USERNAME_EXISTS,
      variables: {
        username,
      },
      fetchPolicy: 'network-only',
    });

    return usernameExists;
  };

  const handleOnFinish = async (values) => {
    const [emailExists, usernameExists] = await Promise.all([
      checkEmail(values.email),
      checkUsername(values.username),
    ]);

    if (emailExists) {
      message.warning('El correo que estás intentando registrar ya le pertenece a alguien más');
    } else if (usernameExists) {
      message.warning('El username que estás intentando registrar ya le pertenece a alguien más');
    } else {
      await onFinish({ ...values, profileImg: values.profileImg || imageUrl });
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleOnFinish}
      form={form}
      initialValues={
        initialValues
          ? {
              ...initialValues,
              dateOfBirth: initialValues.dateOfBirth
                ? moment(initialValues.dateOfBirth)
                : undefined,
            }
          : undefined
      }
      {...props}
    >
      <Item
        style={{ marginTop: 10 }}
        label="Username"
        name="username"
        normalize={(value) => value?.toLowerCase()}
        rules={[
          { min: 5, message: 'El username debe tener almenos 5 caracteres' },
          { required: true, message: 'Ingresa el nombre del usuario' },
        ]}
      >
        <Input disabled={disabled.username} prefix={<UserOutlined />} placeholder="Username" />
      </Item>
      <Item
        style={{ marginTop: 10 }}
        label="Nombre (s)"
        name="firstName"
        rules={[{ required: true, message: 'Ingresa el nombre del usuario' }]}
      >
        <Input disabled={disabled.firstName} prefix={<UserOutlined />} placeholder="Nombre (s)" />
      </Item>
      <Item
        style={{ marginTop: 10 }}
        label="Apellido (s)"
        name="lastName"
        rules={[{ required: true, message: 'Ingresa el apellido del usuario' }]}
      >
        <Input disabled={disabled.lastName} prefix={<UserOutlined />} placeholder="Nombre (s)" />
      </Item>
      <Item
        label="Correo"
        name="email"
        rules={[
          {
            type: 'email',
            message: 'Ingresa un correo válido',
          },
          { required: true, message: 'Ingresa el correo del usuario' },
        ]}
      >
        <Input disabled={disabled.email} prefix={<MailOutlined />} placeholder="Correo" />
      </Item>
      <Item
        label="Fecha de nacimiento"
        name="dateOfBirth"
        rules={[{ required: true, message: 'Ingresa la fecha de nacimiento' }]}
      >
        <DatePicker
          clearIcon={false}
          showToday={false}
          style={{ width: '100%' }}
          placeholder="Fecha de nacimiento"
          disabled={disabled.dateOfBirth}
        />
      </Item>
      <Item label="Imagen de perfil" name="profileImg">
        <ImgCrop name="profileImg">
          <Upload
            name="profileImg"
            listType="picture-card"
            showUploadList={false}
            customRequest={handleUpload}
            beforeUpload={(file) => validateImageTypes(file)}
            accept=".png,.jpg,.jpeg"
            disabled={disabled.profileImg}
          >
            {imageUrl ? (
              <Avatar size={100} shape="square" src={imageUrl} alt="profileImg" />
            ) : (
              <div>
                {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Subir foto</div>
              </div>
            )}
          </Upload>
        </ImgCrop>
      </Item>
      <Item name="overallRole" label="Rol general">
        <Select disabled={disabled.overallRole} placeholder="Rol general">
          {Object.keys(overallRoles).map((role) => (
            <Option key={role} value={role}>
              {overallRoles[role]}
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

UserForm.defaultProps = {
  disabled: {},
  form: null,
  initialValues: null,
};

UserForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  form: PropTypes.object,
  disabled: PropTypes.shape({
    username: PropTypes.bool,
    firstName: PropTypes.bool,
    lastName: PropTypes.bool,
    email: PropTypes.bool,
    dateOfBirth: PropTypes.bool,
    profileImg: PropTypes.bool,
    overallRole: PropTypes.bool,
  }),
  initialValues: PropTypes.shape({
    username: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    dateOfBirth: PropTypes.string,
    profileImg: PropTypes.string,
    overallRole: PropTypes.string,
  }),
};

export default UserForm;
