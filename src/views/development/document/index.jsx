import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import { useParams, Link } from 'react-router-dom';
import Box from '@components/box';
import { documentCategories } from '@config/constants/document';
import { FileAddOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Card, Typography, Select, Avatar, Tag, Divider, Button, Empty } from 'antd';
import Loading from '@components/loading';
import { GET_DOCUMENT } from './requests';
import CreateDocumentVersionModal from './create-document-version-modal';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const Document = () => {
  const [isOpenCreateDocumentVersionModal, toggleCreateDocumentVersionModal] = useState(false);
  const { documentId } = useParams();
  const { data, loading, refetch } = useQuery(GET_DOCUMENT, { variables: { id: documentId } });

  const [selectedVersion, setSelectedVersion] = useState(0);

  useEffect(() => setSelectedVersion(data?.document?.lastVersion.version), [
    data?.document?.lastVersion.version,
  ]);

  const versionToShow = useMemo(
    () => data?.document.versions.results?.find(({ version }) => selectedVersion === version),
    [selectedVersion]
  );

  if (loading && !selectedVersion)
    return (
      <Box display="flex" m={40} justifyContent="center" width="100%">
        <Loading />
      </Box>
    );

  return (
    <>
      <CreateDocumentVersionModal
        visible={isOpenCreateDocumentVersionModal}
        onCancel={() => toggleCreateDocumentVersionModal(false)}
        reloadDocument={refetch}
      />
      <Box p={20}>
        <Card>
          <Box display="flex">
            <Title style={{ marginBottom: 0, marginRight: 'auto' }} level={4}>
              {data.document.name}
            </Title>
            <Button
              type="primary"
              icon={<FileAddOutlined />}
              onClick={() => toggleCreateDocumentVersionModal(true)}
            >
              Añadir versión
            </Button>
          </Box>
          <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'Ver más' }} type="secondary">
            {data.document.description}
          </Paragraph>
          {data.document.versions.results.length > 0 && (
            <Select
              value={data.document.lastVersion?.version || 0}
              style={{ width: '100%' }}
              size="small"
              onChange={setSelectedVersion}
            >
              {data.document.versions.results.map(({ version, createdAt }) => (
                <Option key={version} value={version}>
                  {version === data.document?.lastVersion.version
                    ? `Última versión (${moment(createdAt).format('lll')})`
                    : `Version ${moment(createdAt).format('lll')}`}
                </Option>
              ))}
            </Select>
          )}
        </Card>
        {versionToShow ? (
          <DocViewer
            pluginRenderers={DocViewerRenderers}
            style={{ minHeight: 600 }}
            config={{
              header: {
                disableHeader: true,
              },
            }}
            documents={[
              {
                uri: versionToShow?.fileSource,
              },
            ]}
          />
        ) : (
          <Box my={60}>
            <Empty description="Este documento no tiene ninguna versión disponible" />
          </Box>
        )}
        {data.document.versions.results.length > 0 && (
          <Card>
            {data.document.categories.length > 0 && (
              <>
                <Title style={{ marginBottom: 10 }} level={5}>
                  Categorías
                </Title>
                {data.document.categories.map((category) => (
                  <Tag color="green" key={category}>
                    {documentCategories[category]}
                  </Tag>
                ))}
              </>
            )}
            <Divider style={{ margin: '12px 0' }} />
            <Title style={{ marginBottom: 10 }} level={5}>
              Aprobado por:
            </Title>
            {versionToShow?.approvedBy.map(
              ({ approvalDate, user: { id, username, firstName, lastName, profileImg } }) => (
                <Link key={id} to={`/@${username}`}>
                  <Box my="15px" display="flex">
                    <Box as={Avatar} size={48} src={profileImg} mr="10px" />
                    <Box>
                      <Paragraph style={{ margin: 0 }} strong>
                        {firstName} {lastName}
                      </Paragraph>
                      <Box display="flex">
                        <Text type="secondary" style={{ marginRight: 5 }}>
                          Aprobado el:
                        </Text>
                        <Tag color="success">{moment(approvalDate).format('lll')}</Tag>
                      </Box>
                    </Box>
                  </Box>
                </Link>
              )
            )}
          </Card>
        )}
      </Box>
    </>
  );
};

export default Document;
