import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { InboxOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import useUpload from '@hooks/use-upload';
import Box from '@components/box';
import { useParams } from 'react-router-dom';
import { Modal, Upload, message } from 'antd';
import Loading from '@components/loading';
import { CREATE_DOCUMENT_VERSION } from './requests';

const { Dragger } = Upload;

const CreateDocumentVersionModal = ({ visible, onCancel, reloadDocument }) => {
  const { upload, uploading } = useUpload();
  const [fileSource, setFileSource] = useState('');
  const [fileList, setFileList] = useState([]);
  const { documentId } = useParams();
  const [adding, setAdding] = useState(false);

  const handleUpload = async ({ file, onSuccess }) => {
    const url = await upload(file, file.name);
    setFileSource(url);
    onSuccess();
  };

  const handleUploadChange = ({ fileList: innerFileList }) => {
    setFileList(innerFileList.splice(-1));
  };

  const [createDocumentVersion] = useMutation(CREATE_DOCUMENT_VERSION);

  const handleCreate = async () => {
    setAdding(true);
    await createDocumentVersion({
      variables: {
        document: documentId,
        documentVersion: {
          fileSource,
        },
      },
    });
    onCancel();
    await reloadDocument();
    setFileList([]);
    setAdding(false);
    message.success('Versión del documento añadida correctamente');
  };

  return (
    <Modal
      title="Agrega una versión de este documento"
      visible={visible}
      onOk={handleCreate}
      onCancel={onCancel}
      confirmLoading={adding}
      okButtonProps={{
        disabled: uploading,
      }}
    >
      <Dragger
        fileList={fileList}
        onChange={handleUploadChange}
        multiple={false}
        customRequest={handleUpload}
        accept=".bmp,.doc,.docx,.htm,.html,.jpg,.jpeg,.pdf,.png,.ppt,.pptx,.tiff,.txt,.xls,.xlsx"
      >
        {uploading ? (
          <Box my={20}>
            <Loading />
          </Box>
        ) : (
          <Box as="p" className="ant-upload-drag-icon">
            <InboxOutlined />
          </Box>
        )}
        <Box as="p" className="ant-upload-text">
          Arrastra aquí el archivo o haz click para seleccionar el archivo
        </Box>
      </Dragger>
    </Modal>
  );
};

CreateDocumentVersionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  reloadDocument: PropTypes.func.isRequired,
};

export default CreateDocumentVersionModal;
