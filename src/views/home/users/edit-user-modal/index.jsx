import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { useUser } from '@providers/user';
import UserForm from '@components/user-form';
import Box from '@components/box';
import Loading from '@components/loading';
import { UPDATE_USER, GET_USER } from './requests';

const EditUserModal = ({ onClose, userEditId, visible }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateUser] = useMutation(UPDATE_USER);
  const { user: sessionUser, reloadUser } = useUser();
  const { loading, data } = useQuery(GET_USER, {
    variables: {
      id: userEditId,
    },
    skip: !userEditId,
  });

  const onFinish = async (user) => {
    setSaving(true);
    const { errors } = await updateUser({
      variables: { id: userEditId, user },
    });

    if (userEditId === sessionUser.id) await reloadUser();

    if (errors) {
      message.error(errors[0].message);
    } else {
      onClose();
      message.success('Usuario actualizado con éxito');
    }

    setSaving(false);
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
        <Box display="flex" m={40} justifyContent="center" width="100%">
          <Loading />
        </Box>
      ) : (
        <UserForm
          form={form}
          onFinish={onFinish}
          loading={saving}
          initialValues={{ ...data?.user }}
        />
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
  visible: PropTypes.bool.isRequired,
};

export default EditUserModal;
