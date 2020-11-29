import { useState } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { useDevelopment } from '@providers/development';
import { Modal, message, Input } from 'antd';
import { APPROVE_DOCUMENT_VERSION } from './requests';

const ApproveModal = ({ visible, onCancel, reloadDocument, documentVersionId }) => {
  const [approving, setApproving] = useState(false);
  const [password, setPassword] = useState('');

  const { development } = useDevelopment();

  const [approveDocumentVersion] = useMutation(APPROVE_DOCUMENT_VERSION);

  const handleCreate = async () => {
    setApproving(true);
    const { errors } = await approveDocumentVersion({
      variables: {
        id: documentVersionId,
        development: development.id,
        password,
      },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      onCancel();
      setPassword('');
      await reloadDocument();
      message.success('Versión del documento aprobada correctamente');
    }

    setApproving(false);
  };

  return (
    <Modal
      title="Para aprobar este documento, confirma tu contraseña"
      visible={visible}
      onOk={handleCreate}
      onCancel={onCancel}
      confirmLoading={approving}
    >
      <Input.Password
        onChange={({ target: { value } }) => setPassword(value)}
        value={password}
        placeholder="Confirma tu contraseña"
      />
    </Modal>
  );
};

ApproveModal.defaultProps = {
  documentVersionId: undefined,
};

ApproveModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  reloadDocument: PropTypes.func.isRequired,
  documentVersionId: PropTypes.string,
};

export default ApproveModal;
