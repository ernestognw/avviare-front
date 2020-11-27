import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import DocumentForm from '@components/document-form';
import Box from '@components/box';
import { useDevelopment } from '@providers/development';
import Loading from '@components/loading';
import { UPDATE_DOCUMENT, GET_DOCUMENT } from './requests';

const EditDocumentForm = ({ onClose, documentEditId, visible }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateDocument] = useMutation(UPDATE_DOCUMENT);
  const { development } = useDevelopment();
  const { loading, data } = useQuery(GET_DOCUMENT, {
    variables: {
      id: documentEditId,
    },
    skip: !documentEditId,
  });

  const onFinish = async (document) => {
    setSaving(true);
    const { errors } = await updateDocument({
      variables: { id: documentEditId, document: { ...document, development: development.id } },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      onClose();
      message.success('Documento actualizado con éxito');
    }

    setSaving(false);
  };

  return (
    <Drawer
      title="Editar documento"
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
        <DocumentForm
          form={form}
          loading={saving}
          onFinish={onFinish}
          initialValues={{ ...data?.document }}
        />
      )}
    </Drawer>
  );
};

EditDocumentForm.defaultProps = {
  documentEditId: '',
};

EditDocumentForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  documentEditId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default EditDocumentForm;
