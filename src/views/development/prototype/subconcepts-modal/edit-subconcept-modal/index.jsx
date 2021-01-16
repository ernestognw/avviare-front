import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import SubconceptForm from '@components/subconcept-form';
import Box from '@components/box';
import Loading from '@components/loading';
import { UPDATE_SUBCONCEPT, GET_SUBCONCEPT } from './requests';

const EditSubconceptModal = ({ onClose, subconceptEditId, visible }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateSubconcept] = useMutation(UPDATE_SUBCONCEPT);
  const { loading, data } = useQuery(GET_SUBCONCEPT, {
    variables: {
      id: subconceptEditId,
    },
    skip: !subconceptEditId,
  });

  const onFinish = async ({ subconceptPrototype, ...subconcept }) => {
    setSaving(true);
    const { errors } = await updateSubconcept({
      variables: { id: subconceptEditId, subconcept: { ...subconcept } },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      onClose();
      message.success('Subconcepto actualizado con éxito');
    }

    setSaving(false);
  };

  return (
    <Drawer
      title="Editar subconcepto"
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
        <SubconceptForm
          form={form}
          loading={saving}
          onFinish={onFinish}
          initialValues={{
            ...data?.subconcept,
          }}
        />
      )}
    </Drawer>
  );
};

EditSubconceptModal.defaultProps = {
  subconceptEditId: '',
};

EditSubconceptModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  subconceptEditId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default EditSubconceptModal;
