import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import AllotmentPrototypeForm from '@components/allotment-prototype-form';
import Box from '@components/box';
import Loading from '@components/loading';
import { UPDATE_ALLOTMENT_PROTOTYPE, GET_ALLOTMENT_PROTOTYPE } from './requests';

const EditAllotmentPrototypeModal = ({ onClose, allotmentPrototypeEditId, visible }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateAllotmentPrototype] = useMutation(UPDATE_ALLOTMENT_PROTOTYPE);
  const { loading, data } = useQuery(GET_ALLOTMENT_PROTOTYPE, {
    variables: {
      id: allotmentPrototypeEditId,
    },
    skip: !allotmentPrototypeEditId,
  });

  const onFinish = async (allotmentPrototype) => {
    setSaving(true);
    const { errors } = await updateAllotmentPrototype({
      variables: { id: allotmentPrototypeEditId, allotmentPrototype: { ...allotmentPrototype } },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      onClose();
      message.success('Prototipo actualizado con éxito');
    }

    setSaving(false);
  };

  return (
    <Drawer
      title="Editar prototipo"
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
        <AllotmentPrototypeForm
          form={form}
          loading={saving}
          onFinish={onFinish}
          initialValues={{ ...data?.allotmentPrototype }}
        />
      )}
    </Drawer>
  );
};

EditAllotmentPrototypeModal.defaultProps = {
  allotmentPrototypeEditId: '',
};

EditAllotmentPrototypeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  allotmentPrototypeEditId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default EditAllotmentPrototypeModal;
