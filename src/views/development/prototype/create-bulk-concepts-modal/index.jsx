import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Modal, Alert, Typography, Button, message } from 'antd';
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { useDevelopment } from '@providers/development';
import { useParams } from 'react-router-dom';
import { Upload } from './elements';
import { CREATE_BULK_CONCEPTS } from './requests';

const { Paragraph, Link } = Typography;

const CreateBulkConceptsModal = ({ visible, onCancel, updateConcepts }) => {
  const [file, setFile] = useState();
  const [uploading, setUploading] = useState(false);
  const { development } = useDevelopment();
  const { allotmentPrototypeId } = useParams();

  const [createBulkConcepts] = useMutation(CREATE_BULK_CONCEPTS);

  const beforeUpload = (newFile) => {
    setFile(newFile);

    return false; // Needed to avoid auto-upload
  };

  const upload = async () => {
    setUploading(true);

    if (!file) {
      message.warning('Necesitas cargar un archivo');
    } else {
      const { errors } = await createBulkConcepts({
        variables: {
          template: file,
          allotmentPrototype: allotmentPrototypeId,
        },
      });

      if (errors) {
        message.error(errors[0].message);
      } else {
        message.success('Conceptos y subconceptos creados correctamente');
      }
    }

    setFile();
    updateConcepts();
    onCancel();
    setUploading(false);
  };

  return (
    <Modal
      title={`Agrega a un proveedor a ${development.name}`}
      visible={visible}
      onOk={upload}
      onCancel={onCancel}
      confirmLoading={uploading}
    >
      <Upload
        fileList={file ? [file] : []}
        beforeUpload={beforeUpload}
        onRemove={() => setFile()}
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Alert
        message="Template"
        description={
          <>
            <Paragraph style={{ margin: 0 }}>
              Utiliza el siguiente template para cargar los conceptos y sus subconceptos en formato
              de excel. De no utilizarse, el proceso no se podrá completar correctamente
            </Paragraph>
            <Link
              // Assumed constant
              href="https://avviare-production.s3.amazonaws.com/bulk_concepts_template.xlsx"
              target="_blank"
            >
              <Button style={{ marginTop: 10 }} icon={<FileExcelOutlined />} type="primary">
                Descargar template
              </Button>
            </Link>
          </>
        }
        type="info"
        showIcon
        style={{ marginBottom: 10 }}
      />
    </Modal>
  );
};

CreateBulkConceptsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  updateConcepts: PropTypes.func.isRequired,
};

export default CreateBulkConceptsModal;
