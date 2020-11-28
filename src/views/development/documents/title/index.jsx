import { useState } from 'react';
import JSZip from 'jszip';
import PropTypes from 'prop-types';
import axios from 'axios';
import { downloadFile } from '@config/utils/files';
import moment from 'moment';
import { useApolloClient } from '@apollo/client';
import { Button, Input, Typography, Select, Popconfirm, message } from 'antd';
import { documentCategories } from '@config/constants/document';
import { FileAddOutlined, DownloadOutlined } from '@ant-design/icons';
import Box from '@components/box';
import { useDevelopment } from '@providers/development';
import { TitleContainer } from './elements';
import { GET_DOCUMENTS } from './requests';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const TableTitle = ({ setCategories, setSearch, openCreateDocumentModal }) => {
  const [downloading, setDownloading] = useState();
  const { development, developmentRole } = useDevelopment();
  const { query } = useApolloClient();

  const getDocs = async () => {
    const { data } = await query({
      query: GET_DOCUMENTS,
      variables: {
        development: {
          in: development.id,
        },
      },
      fetchPolicy: 'network-only',
    });

    return data.documents.results;
  };

  const zipFiles = async (urls) => {
    const files = await Promise.all(
      urls.map(({ url }) => axios.get(url, { responseType: 'arraybuffer' }))
    );

    const zip = new JSZip();

    files.forEach(({ data }, index) => {
      const pointIndex = urls[index].url.lastIndexOf('.');
      const extension = urls[index].url.slice(pointIndex);
      zip.file(`${urls[index].name}${extension}`, data);
    });

    return zip.generateAsync({ type: 'base64' });
  };

  const downloadFinal = async () => {
    setDownloading(true);
    const documents = await getDocs();

    const urls = documents
      .filter(({ finalVersion }) => !!finalVersion)
      .map(({ name, finalVersion }) => ({
        name: name.replace(/ /g, '-'),
        url: finalVersion.fileSource,
      }));

    if (urls.length === 0) {
      message.warning('Ningún documento tiene versión final');
    } else {
      const zipFileBase64 = await zipFiles(urls);
      downloadFile(
        `data:application/zip;base64,${zipFileBase64}`,
        `${development.name}-finals-${moment().format('lll')}`
      );
    }

    setDownloading(false);
  };

  const downloadRecent = async () => {
    setDownloading(true);
    const documents = await getDocs();

    const urls = documents
      .filter(({ lastVersion }) => !!lastVersion)
      .map(({ name, lastVersion }) => ({
        name: name.replace(/ /g, '-'),
        url: lastVersion.fileSource,
      }));

    if (urls.length === 0) {
      message.warning('Ningún documento tiene versión final');
    } else {
      const zipFileBase64 = await zipFiles(urls);
      downloadFile(
        `data:application/zip;base64,${zipFileBase64}`,
        `${development.name}-latest-${moment().format('lll')}`
      );
    }

    setDownloading(false);
  };

  return (
    <TitleContainer>
      <Box display="flex">
        <Title style={{ margin: 'auto 10px' }} level={3}>
          Documentos de {development.name}
        </Title>

        <Button
          style={{ margin: '10px 0 auto auto' }}
          type="primary"
          disabled={!developmentRole.manager}
          icon={<FileAddOutlined />}
          onClick={openCreateDocumentModal}
        >
          Añadir
        </Button>
      </Box>
      <Box display="flex" mt={10}>
        <Select
          style={{ width: 250, margin: 'auto 10px auto auto' }}
          mode="multiple"
          allowClear
          placeholder="Filtrar por categorías"
          onChange={setCategories}
        >
          {Object.keys(documentCategories).map((category) => (
            <Option key={category} value={category}>
              {documentCategories[category]}
            </Option>
          ))}
        </Select>
        <Search
          style={{ width: 250, margin: 'auto 0 auto 10px' }}
          allowClear
          placeholder="Buscar documentos"
          onChange={({ target: { value } }) => setSearch(value)}
        />
        <Popconfirm
          title="¿Cómo quieres descargar los documentos?"
          onConfirm={downloadFinal}
          onCancel={downloadRecent}
          okText="Versiones finales"
          cancelText="Versiones más recientes"
        >
          <Button
            loading={downloading}
            style={{ margin: 'auto 0 auto 10px' }}
            icon={<DownloadOutlined />}
          >
            Descargar
          </Button>
        </Popconfirm>
      </Box>
    </TitleContainer>
  );
};

TableTitle.propTypes = {
  setCategories: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  openCreateDocumentModal: PropTypes.func.isRequired,
};

export default TableTitle;
