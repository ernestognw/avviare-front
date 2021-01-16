import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import ConceptForm from '@components/concept-form';
import Box from '@components/box';
import Loading from '@components/loading';
import { UPDATE_CONCEPT, GET_CONCEPT } from './requests';

const EditConceptModal = ({ onClose, conceptEditId, visible }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateConcept] = useMutation(UPDATE_CONCEPT);
  const { loading, data } = useQuery(GET_CONCEPT, {
    variables: {
      id: conceptEditId,
    },
    skip: !conceptEditId,
  });

  const onFinish = async ({ ...concept }) => {
    setSaving(true);
    const { errors } = await updateConcept({
      variables: { id: conceptEditId, concept: { ...concept } },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      onClose();
      message.success('Concepto actualizado con éxito');
    }

    setSaving(false);
  };

  return (
    <Drawer
      title="Editar concepto"
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
        <ConceptForm
          form={form}
          loading={saving}
          onFinish={onFinish}
          initialValues={{
            ...data?.concept,
          }}
        />
      )}
    </Drawer>
  );
};

EditConceptModal.defaultProps = {
  conceptEditId: '',
};

EditConceptModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  conceptEditId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default EditConceptModal;
