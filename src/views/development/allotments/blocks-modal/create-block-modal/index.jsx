import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, Modal, message } from 'antd';
import { useMutation } from '@apollo/client';
import { useDevelopment } from '@providers/development';
import BlockForm from '@components/block-form';
import { CREATE_BLOCK } from './requests';

const CreateBlockModal = ({ onClose, visible, updateBlocks }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [createBlock] = useMutation(CREATE_BLOCK);
  const { development } = useDevelopment();

  const saveBlock = async (block) => {
    setSaving(true);

    const { errors } = await createBlock({
      variables: { block: { development: development.id, ...block } },
    });
    if (errors) {
      message.error(errors[0].message);
    } else {
      await updateBlocks();
      onClose();
      form.resetFields();
      message.success('La manzana ha sido creada correctamente');
    }

    setSaving(false);
  };

  const onFinish = (block) =>
    Modal.confirm({
      title: '¿Quieres guardar esta manzana?',
      content: 'Una vez creada, no se podrá eliminar',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => saveBlock(block),
    });

  return (
    <Drawer
      title="Crear una manzana"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <BlockForm form={form} loading={saving} onFinish={onFinish} />
    </Drawer>
  );
};

CreateBlockModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateBlocks: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateBlockModal;
