import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, Modal, message } from 'antd';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import ConceptForm from '@components/concept-form';
import { CREATE_CONCEPT } from './requests';

const CreateConceptModal = ({ onClose, visible, updateConcepts }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [createConcept] = useMutation(CREATE_CONCEPT);
  const { allotmentPrototypeId } = useParams();

  const saveConcept = async (concept) => {
    setSaving(true);

    const { errors } = await createConcept({
      variables: { concept: { allotmentPrototype: allotmentPrototypeId, ...concept } },
    });
    if (errors) {
      message.error(errors[0].message);
    } else {
      await updateConcepts();
      onClose();
      form.resetFields();
      message.success('El concepto ha sido creado correctamente');
    }

    setSaving(false);
  };

  const onFinish = (concept) =>
    Modal.confirm({
      title: '¿Quieres guardar este concepto?',
      content: 'Una vez creado, no podrá ser removido',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => saveConcept(concept),
    });

  return (
    <Drawer
      title="Crear un concepto"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <ConceptForm form={form} loading={saving} onFinish={onFinish} />
    </Drawer>
  );
};

CreateConceptModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateConcepts: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateConceptModal;
