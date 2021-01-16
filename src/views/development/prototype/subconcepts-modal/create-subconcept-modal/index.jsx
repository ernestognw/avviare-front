import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, Modal, message } from 'antd';
import { useMutation } from '@apollo/client';
import SubconceptForm from '@components/subconcept-form';
import { CREATE_SUBCONCEPT } from './requests';

const CreateSubconceptModal = ({
  conceptId,
  onClose,
  visible,
  updateSubconcepts,
  onSubconceptAdded,
}) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [createSubconcept] = useMutation(CREATE_SUBCONCEPT);

  const saveSubconcept = async (subconcept) => {
    setSaving(true);

    const { errors } = await createSubconcept({
      variables: { subconcept: { concept: conceptId, ...subconcept } },
    });
    if (errors) {
      message.error(errors[0].message);
    } else {
      await Promise.all([updateSubconcepts(), onSubconceptAdded()]);
      onClose();
      form.resetFields();
      message.success('El subconcepto ha sido creado correctamente');
    }

    setSaving(false);
  };

  const onFinish = (subconcept) =>
    Modal.confirm({
      title: '¿Quieres guardar este subconcepto?',
      content: 'Una vez creado, no se podrá eliminar',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => saveSubconcept(subconcept),
    });

  return (
    <Drawer
      title="Crear un subconcepto"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <SubconceptForm form={form} loading={saving} onFinish={onFinish} />
    </Drawer>
  );
};

CreateSubconceptModal.defaultProps = {
  conceptId: '',
};

CreateSubconceptModal.propTypes = {
  onSubconceptAdded: PropTypes.func.isRequired,
  conceptId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  updateSubconcepts: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateSubconceptModal;
