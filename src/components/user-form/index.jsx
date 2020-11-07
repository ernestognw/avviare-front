import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import ImgCrop from 'antd-img-crop';
import { overallRoles } from '@config/constants/user';
import client from '@graphql';
import useUpload from '@hooks/use-upload';
import { UserOutlined, LoadingOutlined, PlusOutlined, MailOutlined } from '@ant-design/icons';
import { Form, Input, DatePicker, Button, Select, Avatar, Upload, message } from 'antd';
import Box from '@components/box';
import Loading from '@components/loading';
import { EMAIL_EXISTS, USERNAME_EXISTS } from './requests';

const { Item } = Form;
const { Option } = Select;

const UserForm = forwardRef(({ onFinish, loadingUser, saving, form, ...props }, ref) => {
  const { upload, uploading, progress } = useUpload();
  const [imageUrl, setImageUrl] = useState('');

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Sólo está permitido subir imágenes en formato PNG o JPG');
    }
    const isLessThanTwoMB = file.size / 1024 / 1024 < 2;
    if (!isLessThanTwoMB) {
      message.error('La imagen debe medir menos de 2 mb');
    }

    return isJpgOrPng && isLessThanTwoMB;
  };

  const handleUpload = async ({ file }) => {
    const url = await upload(file, file.name);
    setImageUrl(url);
  };

  const checkEmail = async (email) => {
    if (email === form.getFieldValue('email')) return false;
    const {
      data: { userEmailExists },
    } = await client.query({
      query: EMAIL_EXISTS,
      variables: {
        email,
      },
    });

    return userEmailExists;
  };

  const checkUsername = async (username) => {
    if (username === form.getFieldValue('username')) return false;
    const {
      data: { usernameExists },
    } = await client.query({
      query: USERNAME_EXISTS,
      variables: {
        username,
      },
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
      setImageUrl('');
    }
  };

  return (
    <Form layout="vertical" onFinish={handleOnFinish} form={form} ref={ref} {...props}>
      {loadingUser ? (
        <Box display="flex" m={40} justifyContent="center" width="100%">
          <Loading />
        </Box>
      ) : (
        <>
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
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Item>
          <Item
            style={{ marginTop: 10 }}
            label="Nombre (s)"
            name="firstName"
            rules={[{ required: true, message: 'Ingresa el nombre del usuario' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nombre (s)" />
          </Item>
          <Item
            style={{ marginTop: 10 }}
            label="Apellido (s)"
            name="lastName"
            rules={[{ required: true, message: 'Ingresa el apellido del usuario' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nombre (s)" />
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
            <Input prefix={<MailOutlined />} placeholder="Correo" />
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
            />
          </Item>
          <Item label="Imagen de perfil" name="profileImg">
            <ImgCrop name="profileImg">
              <Upload
                name="profileImg"
                listType="picture-card"
                showUploadList={false}
                customRequest={handleUpload}
                beforeUpload={beforeUpload}
                progress={progress}
                accept=".png,.jpg,.jpeg"
              >
                {imageUrl ? (
                  <Avatar size={100} shape="square" src={imageUrl} alt="profileImg" />
                ) : (
                  <div>
                    {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Item>
          <Item name="overallRole" label="Rol general">
            <Select placeholder="Rol general">
              {Object.keys(overallRoles).map((role) => (
                <Option key={role} value={role}>
                  {overallRoles[role]}
                </Option>
              ))}
            </Select>
          </Item>
          <Item style={{ marginTop: 20 }}>
            <Button
              loading={saving}
              style={{ display: 'block', marginLeft: 'auto' }}
              type="primary"
              htmlType="submit"
            >
              Guardar
            </Button>
          </Item>
        </>
      )}
    </Form>
  );
});

UserForm.defaultProps = {
  loadingUser: false,
};

UserForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  loadingUser: PropTypes.bool,
  form: PropTypes.object.isRequired,
};

export default UserForm;
