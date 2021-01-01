import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import BlockForm from '@components/block-form';
import Box from '@components/box';
import Loading from '@components/loading';
import { UPDATE_BLOCK, GET_BLOCK } from './requests';

const EditBlockModal = ({ onClose, blockEditId, visible }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateBlock] = useMutation(UPDATE_BLOCK);
  const { loading, data } = useQuery(GET_BLOCK, {
    variables: {
      id: blockEditId,
    },
    skip: !blockEditId,
  });

  const onFinish = async ({ blockPrototype, ...block }) => {
    setSaving(true);
    const { errors } = await updateBlock({
      variables: { id: blockEditId, block: { ...block } },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      onClose();
      message.success('Manzana actualizada con éxito');
    }

    setSaving(false);
  };

  return (
    <Drawer
      title="Editar manzana"
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
        <BlockForm
          form={form}
          loading={saving}
          onFinish={onFinish}
          initialValues={{
            ...data?.block,
          }}
        />
      )}
    </Drawer>
  );
};

EditBlockModal.defaultProps = {
  blockEditId: '',
};

EditBlockModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  blockEditId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default EditBlockModal;
