import { useState } from 'react';
import JSZip from 'jszip';
import PropTypes from 'prop-types';
import axios from 'axios';
import { downloadFile } from '@utils/files';
import { useApolloClient } from '@apollo/client';
import { Button, Input, Typography, Select, Popconfirm, Radio, message } from 'antd';
import { documentCategories } from '@config/constants/document';
import {
  FileAddOutlined,
  DownloadOutlined,
  AppstoreOutlined,
  TableOutlined,
} from '@ant-design/icons';
import Box from '@components/box';
import { useLayout } from '@providers/layout';
import { useDevelopment } from '@providers/development';
import { TitleContainer } from './elements';
import { GET_DOCUMENTS } from './requests';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const TableTitle = ({ categories, setCategories, search, setSearch, openCreateDocumentModal }) => {
  const [downloading, setDownloading] = useState();
  const { development, developmentRole } = useDevelopment();
  const { query } = useApolloClient();
  const { displays, setDisplays } = useLayout();

  const getDocs = async () => {
    const { data } = await query({
      query: GET_DOCUMENTS,
      variables: {
        development: {
          eq: development.id,
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
      zip.file(`${urls[index].name}_Version-${urls[index].version}${extension}`, data);
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
        version: finalVersion.version,
      }));

    if (urls.length === 0) {
      message.warning('Ningún documento tiene versión final');
    } else {
      const zipFileBase64 = await zipFiles(urls);
      downloadFile(
        `data:application/zip;base64,${zipFileBase64}`,
        `${development.name.replace(/ /g, '-')}-finals`
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
        version: lastVersion.version,
      }));

    if (urls.length === 0) {
      message.warning('Ningún documento tiene versión final');
    } else {
      const zipFileBase64 = await zipFiles(urls);
      downloadFile(
        `data:application/zip;base64,${zipFileBase64}`,
        `${development.name.replace(/ /g, '-')}-latest`
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
        <Radio.Group
          style={{ margin: '10px 10px auto auto' }}
          optionType="button"
          onChange={({ target: { value } }) => setDisplays({ documents: value })}
          defaultValue={displays.documents}
        >
          <Radio.Button value="table">
            <TableOutlined />
          </Radio.Button>
          <Radio.Button value="grid">
            <AppstoreOutlined />
          </Radio.Button>
        </Radio.Group>
        <Button
          style={{ marginTop: 10 }}
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
          value={categories}
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
          value={search}
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

TableTitle.defaultProps = {
  categories: [],
  search: '',
};

TableTitle.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(documentCategories))),
  setCategories: PropTypes.func.isRequired,
  search: PropTypes.string,
  setSearch: PropTypes.func.isRequired,
  openCreateDocumentModal: PropTypes.func.isRequired,
};

export default TableTitle;
