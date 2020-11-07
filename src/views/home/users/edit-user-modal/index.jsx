import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import client from '@graphql';
import {
  Drawer,
  Button,
  Form,
  Input,
  DatePicker,
  Upload,
  Avatar,
  Select,
  Spin,
  message,
} from 'antd';
import { UserOutlined, MailOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import moment from 'moment';
import { useMutation, useQuery } from '@apollo/client';
import { overallRoles } from '@config/constants';
import useUpload from '@hooks/use-upload';
import { EMAIL_EXISTS, USERNAME_EXISTS, UPDATE_USER, GET_USER } from './requests';

const { Item } = Form;
const { Option } = Select;

const EditUserModal = ({ onClose, userEditId, visible, updateUsers }) => {
  const [creating, setCreating] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { upload, uploading, progress } = useUpload();
  const [form] = Form.useForm();
  const [updateUser] = useMutation(UPDATE_USER);
  const { loading, data } = useQuery(GET_USER, {
    variables: {
      id: userEditId,
    },
  });

  useEffect(() => {
    if (data?.user) {
      form.setFieldsValue({ ...data.user, dateOfBirth: moment(data.user.dateOfBirth) });
      setImageUrl(data.user.profileImg);
    }
  }, [data, form]);

  const checkEmail = async (email) => {
    if (email === data.user.email) return false;

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
    if (username === data.user.username) return false;

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

  const onFinish = async (formData) => {
    setCreating(true);
    const [emailExists, usernameExists] = await Promise.all([
      checkEmail(formData.email),
      checkUsername(formData.username),
    ]);

    if (emailExists) {
      message.warning('El correo que estás intentando registrar ya le pertenece a alguien más');
    } else if (usernameExists) {
      message.warning('El username que estás intentando registrar ya le pertenece a alguien más');
    } else {
      await updateUser({
        variables: { id: userEditId, user: { ...formData, profileImg: imageUrl } },
      });
      await updateUsers();
      onClose();
      form.resetFields();
      message.success('Usuario actualizado con éxito');
    }

    setCreating(false);
  };

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

  return (
    <Drawer
      title="Editar usuario"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      {loading ? (
        <div
          style={{
            display: 'flex',
            margin: 40,
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
      )}
    </Drawer>
  );
};

EditUserModal.defaultProps = {
  userEditId: '',
};

EditUserModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  userEditId: PropTypes.string,
  updateUsers: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default EditUserModal;
