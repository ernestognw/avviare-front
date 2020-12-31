import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import AllotmentForm from '@components/allotment-form';
import Box from '@components/box';
import Loading from '@components/loading';
import { UPDATE_ALLOTMENT, GET_ALLOTMENT } from './requests';

const EditAllotmentModal = ({ onClose, allotmentEditId, visible }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateAllotment] = useMutation(UPDATE_ALLOTMENT);
  const { loading, data } = useQuery(GET_ALLOTMENT, {
    variables: {
      id: allotmentEditId,
    },
    skip: !allotmentEditId,
  });

  const onFinish = async ({ allotmentPrototype, ...allotment }) => {
    setSaving(true);
    const { errors } = await updateAllotment({
      variables: { id: allotmentEditId, allotment: { ...allotment } },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      onClose();
      message.success('Lote actualizado con éxito');
    }

    setSaving(false);
  };

  return (
    <Drawer
      title="Editar lote"
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
        <AllotmentForm
          form={form}
          loading={saving}
          onFinish={onFinish}
          disabled={{
            allotmentPrototype: true,
          }}
          initialValues={{
            ...data?.allotment,
            block: data?.allotment.block.id,
            allotmentPrototype: data?.allotment.allotmentPrototype.id,
          }}
        />
      )}
    </Drawer>
  );
};

EditAllotmentModal.defaultProps = {
  allotmentEditId: '',
};

EditAllotmentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  allotmentEditId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default EditAllotmentModal;
