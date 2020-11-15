import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation } from '@apollo/client';
import { useDevelopment } from '@providers/development';
import DocumentForm from '@components/document-form';
import { CREATE_DOCUMENT } from './requests';

const CreateDocumentModal = ({ onClose, visible, updateDocuments }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [createDocument] = useMutation(CREATE_DOCUMENT);
  const { development } = useDevelopment();

  const onFinish = async (document) => {
    setSaving(true);

    const { errors } = await createDocument({
      variables: { document: { development: development.id, ...document } },
    });
    if (errors) {
      message.error(errors[0]);
    } else {
      await updateDocuments();
      onClose();
      form.resetFields();
      message.success('El documento ha sido creado correctamente');
    }

    setSaving(false);
  };

  return (
    <Drawer
      title="Crear un documento"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <DocumentForm form={form} loading={saving} onFinish={onFinish} />
    </Drawer>
  );
};

CreateDocumentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateDocuments: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateDocumentModal;
