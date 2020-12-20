import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import ProviderForm from '@components/provider-form';
import Box from '@components/box';
import Loading from '@components/loading';
import { UPDATE_PROVIDER, GET_PROVIDER } from './requests';

const EditProviderModal = ({ onClose, providerEditId, visible }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateProvider] = useMutation(UPDATE_PROVIDER);
  const { loading, data } = useQuery(GET_PROVIDER, {
    variables: {
      id: providerEditId,
    },
    skip: !providerEditId,
  });

  const onFinish = async (provider) => {
    setSaving(true);
    const { errors } = await updateProvider({
      variables: { id: providerEditId, provider },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      onClose();
      message.success('Proveedor actualizado con éxito');
    }

    setSaving(false);
  };

  return (
    <Drawer
      title="Editar proveedor"
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
        <ProviderForm
          form={form}
          onFinish={onFinish}
          loading={saving}
          initialValues={{ ...data?.provider }}
        />
      )}
    </Drawer>
  );
};

EditProviderModal.defaultProps = {
  providerEditId: '',
};

EditProviderModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  providerEditId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default EditProviderModal;
