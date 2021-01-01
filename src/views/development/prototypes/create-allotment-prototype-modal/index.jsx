import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, Alert, Modal, message } from 'antd';
import { useMutation } from '@apollo/client';
import { useDevelopment } from '@providers/development';
import AllotmentPrototypeForm from '@components/allotment-prototype-form';
import { CREATE_ALLOTMENT_PROTOTYPE } from './requests';

const CreateAllotmentPrototypeModal = ({ onClose, visible, updateAllotmentPrototypes }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [createAllotmentPrototype] = useMutation(CREATE_ALLOTMENT_PROTOTYPE);
  const { development } = useDevelopment();

  const savePrototype = async (allotmentPrototype) => {
    setSaving(true);

    const { errors } = await createAllotmentPrototype({
      variables: { allotmentPrototype: { development: development.id, ...allotmentPrototype } },
    });
    if (errors) {
      message.error(errors[0].message);
    } else {
      await updateAllotmentPrototypes();
      onClose();
      form.resetFields();
      message.success('El prototipo ha sido creado correctamente');
    }

    setSaving(false);
  };

  const onFinish = (allotmentPrototype) =>
    Modal.confirm({
      title: '¿Quieres guardar este prototipo?',
      content: 'Una vez creado, no se podrá eliminar.',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => savePrototype(allotmentPrototype),
    });

  return (
    <Drawer
      title="Crear un prototipo"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Alert
        message="La configuración de conceptos y subconceptos del prototipo las podrás hacer más adelante"
        type="info"
        showIcon
        style={{ marginBottom: 10 }}
      />
      <AllotmentPrototypeForm form={form} loading={saving} onFinish={onFinish} />
    </Drawer>
  );
};

CreateAllotmentPrototypeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateAllotmentPrototypes: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateAllotmentPrototypeModal;
