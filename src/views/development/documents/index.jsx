/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import { useDevelopment } from '@providers/development';
import { downloadFile } from '@config/utils/files';
import { useLayout } from '@providers/layout';
import { searchableFields } from '@config/constants/document';
import { GET_DOCUMENTS } from './requests';
import { Container } from './elements';
import Title from './title';
import CreateDocumentModal from './create-document-modal';
import EditDocumentModal from './edit-document-modal';
import DocumentsTable from './documents-table';
import DocumentsGrid from './documents-grid';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Documents = () => {
  const [search, setSearch] = useState('');
  const [documentEditId, setDocumentEditId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isOpenCreateDocumentModal, toggleCreateDocumentModal] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const { development } = useDevelopment();
  const [debouncedSearch] = useDebounce(search, 500);
  const { displays } = useLayout();

  const { data, loading, refetch } = useQuery(GET_DOCUMENTS, {
    variables: {
      params,
      search: searchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedSearch;
        return acc;
      }, {}),
      development: {
        eq: development.id,
      },
      categories:
        categories.length > 0
          ? {
              in: categories,
            }
          : undefined,
    },
  });

  const download = async ({ fileSource, name, version }) => {
    const filename = `${name.replace(/ /g, '-')}_Version-${version}`;
    const { data: blob } = await axios.get(fileSource, { responseType: 'blob' });
    const url = window.URL.createObjectURL(blob);
    downloadFile(url, filename);
    window.URL.revokeObjectURL(data);
  };

  const pagination = {
    current: params.page,
    defaultCurrent: defaultParams.page,
    pageSize: params.pageSize,
    defaultPageSize: defaultParams.pageSize,
    total: data?.documents.info.count,
    showTotal: (total) => `${total} usuarios`,
    showSizeChanger: true,
    onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
    onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
  };

  return (
    <>
      <Container>
        {displays.documents === 'table' && (
          <DocumentsTable
            download={download}
            loading={loading}
            pagination={pagination}
            documents={data?.documents.results}
            setDocumentEditId={setDocumentEditId}
            title={() => (
              <Title
                setCategories={setCategories}
                setSearch={setSearch}
                openCreateDocumentModal={() => toggleCreateDocumentModal(true)}
              />
            )}
          />
        )}
        {displays.documents === 'grid' && (
          <DocumentsGrid
            download={download}
            loading={loading}
            pagination={pagination}
            documents={data?.documents.results}
            setDocumentEditId={setDocumentEditId}
            title={() => (
              <Title
                setCategories={setCategories}
                setSearch={setSearch}
                openCreateDocumentModal={() => toggleCreateDocumentModal(true)}
              />
            )}
          />
        )}
      </Container>
      <CreateDocumentModal
        visible={isOpenCreateDocumentModal}
        onClose={() => toggleCreateDocumentModal(false)}
        updateDocuments={refetch}
      />
      <EditDocumentModal
        visible={!!documentEditId}
        onClose={() => setDocumentEditId('')}
        documentEditId={documentEditId}
      />
    </>
  );
};

export default Documents;
