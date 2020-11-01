import React, { useState } from 'react';
import PropTypes from 'prop-types';
import client from '@graphql';
import { Drawer, Button, Form, Input, DatePicker, Upload, Avatar, Select, message } from 'antd';
import { UserOutlined, MailOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { useMutation } from '@apollo/client';
import { overallRoles } from '@config/constants';
import useUpload from '@hooks/use-upload';
import { EMAIL_EXISTS, CREATE_USER } from './requests';

const { Item } = Form;
const { Option } = Select;

const CreateUserModal = ({ onClose, visible, updateUsers }) => {
  const [creating, setCreating] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { upload, uploading, progress } = useUpload();
  const [form] = Form.useForm();
  const [createUser] = useMutation(CREATE_USER);

  const checkEmail = async (email) => {
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

  const onFinish = async (data) => {
    setCreating(true);
    const emailExists = await checkEmail(data.email);

    if (emailExists) {
      message.warning('El correo que estás intentando registrar ya le pertenece a alguien más');
      return;
    }

    await createUser({ variables: { user: { ...data, profileImg: imageUrl } } });
    await updateUsers();

    setCreating(false);
    onClose();
    form.resetFields();
    message.success('El usuario recibirá sus instrucciones de acceso en su correo');
  };

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Sólo está permitido subir imágenes en formato PNG o JPG');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe medir menos de 2 mb');
    }

    return isJpgOrPng && isLt2M;
  };

  const handleUpload = async ({ file }) => {
    const url = await upload(file, file.name);
    setImageUrl(url);
  };

  return (
    <Drawer
      title="Crea un nuevo usuario"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ overallRole: 'USER' }}
        onFinish={onFinish}
      >
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
            showToday={false}
            style={{ width: '100%' }}
            placeholder="Fecha de nacimiento"
          />
        </Item>
        <Item label="Imagen de perfil" name="profileImg">
          <ImgCrop>
            <Upload
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
            loading={creating}
            style={{ display: 'block', marginLeft: 'auto' }}
            type="primary"
            htmlType="submit"
          >
            Crear
          </Button>
        </Item>
      </Form>
    </Drawer>
  );
};

CreateUserModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateUsers: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateUserModal;
