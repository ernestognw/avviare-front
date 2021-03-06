import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import Box from '@components/box';
import axios from 'axios';
import { documentCategories } from '@config/constants/document';
import {
  FileAddOutlined,
  FlagOutlined,
  CheckOutlined,
  CloudDownloadOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { useDevelopment } from '@providers/development';
import { downloadFile } from '@utils/files';
import { useUser } from '@providers/user';
import {
  Card,
  Typography,
  Select,
  Avatar,
  Tag,
  Divider,
  Button,
  Empty,
  Breadcrumb,
  message,
} from 'antd';
import Loading from '@components/loading';
import { GET_DOCUMENT, UPDATE_DOCUMENT } from './requests';
import CreateDocumentVersionModal from './create-document-version-modal';
import ApproveModal from './approve-modal';
import DocumentViewer from './document-viewer';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const Document = () => {
  const [isOpenApproveModal, toggleApproveModal] = useState(false);
  const [isOpenCreateDocumentVersionModal, toggleCreateDocumentVersionModal] = useState(false);
  const [settingFinalVersion, setSettingFinalVersion] = useState(false);
  const { documentId } = useParams();
  const { developmentRole, development } = useDevelopment();
  const { user } = useUser();
  const { data, loading, refetch } = useQuery(GET_DOCUMENT, { variables: { id: documentId } });
  const [setFinalVersion] = useMutation(UPDATE_DOCUMENT);

  const [selectedVersion, setSelectedVersion] = useState(0);

  useEffect(
    () =>
      setSelectedVersion(
        data?.document?.finalVersion?.version || data?.document?.lastVersion?.version
      ),
    [data?.document?.finalVersion?.version, data?.document?.lastVersion?.version]
  );

  const versionToShow = useMemo(
    () => data?.document.versions.results?.find(({ version }) => selectedVersion === version),
    [selectedVersion, data?.document?.versions]
  );

  const hasApprovedThisVersion = useMemo(
    () => versionToShow?.approvedBy?.some(({ user: userApproved }) => userApproved.id === user.id),
    [versionToShow]
  );

  const downloadVersion = async () => {
    const { version, fileSource } = versionToShow;
    const filename = `${data.document.name.replace(/ /g, '-')}_Version-${version}`;
    const { data: blob } = await axios.get(fileSource, { responseType: 'blob' });
    const url = window.URL.createObjectURL(blob);
    downloadFile(url, filename);
    window.URL.revokeObjectURL(data);
  };

  const handleSetFinalVersion = async (finalVersion) => {
    setSettingFinalVersion(true);
    await setFinalVersion({
      variables: {
        id: data.document.id,
        document: {
          finalVersion,
        },
      },
    });
    if (finalVersion) {
      message.success('Se ha definido a esta versi??n como la final para este documento');
    } else {
      message.success('Se ha removido la versi??n final de este documento');
    }
    setSettingFinalVersion(false);
  };

  if (loading && !selectedVersion)
    return (
      <Box display="flex" m={40} justifyContent="center" width="100%">
        <Loading />
      </Box>
    );

  return (
    <>
      <Box px={20} pt={20}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/development/${development.id}`}>
              <BlockOutlined style={{ marginRight: 5 }} />
              {development.name}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/development/${development.id}/documents`}>Documentos</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{data.document.name}</Breadcrumb.Item>
        </Breadcrumb>
      </Box>
      <ApproveModal
        visible={isOpenApproveModal}
        onCancel={() => toggleApproveModal(false)}
        reloadDocument={refetch}
        documentVersionId={versionToShow?.id}
      />
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
              disabled={!!data.document.finalVersion}
              icon={<FileAddOutlined />}
              onClick={() => toggleCreateDocumentVersionModal(true)}
            >
              A??adir versi??n
            </Button>
          </Box>
          <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'Ver m??s' }} type="secondary">
            {data.document.description}
          </Paragraph>
          {data.document.versions.info.count > 0 && (
            <Box display="flex">
              <Select
                value={selectedVersion}
                style={{ width: '100%' }}
                size="small"
                onChange={(value) => setSelectedVersion(Number(value))}
              >
                {data.document.versions.results.map(({ version, createdAt }) => (
                  <Option key={version} value={version}>
                    {version === data.document.finalVersion?.version
                      ? `Versi??n final (${moment(createdAt).format('lll')})`
                      : version === data.document.lastVersion?.version
                      ? `??ltima versi??n (${moment(createdAt).format('lll')})`
                      : `Version ${moment(createdAt).format('lll')}`}
                  </Option>
                ))}
              </Select>
              <Button
                disabled={settingFinalVersion || !developmentRole.manager}
                loading={settingFinalVersion}
                size="small"
                onClick={() =>
                  handleSetFinalVersion(
                    versionToShow?.id === data.document.finalVersion?.id ? null : versionToShow?.id
                  )
                }
                style={{ marginLeft: 10 }}
                icon={<FlagOutlined />}
              >
                {versionToShow?.id === data.document.finalVersion?.id
                  ? 'Desmarcar como final'
                  : 'Marcar como final'}
              </Button>
              <Button
                disabled={!developmentRole.manager}
                type="primary"
                size="small"
                onClick={downloadVersion}
                style={{ marginLeft: 10 }}
                icon={<CloudDownloadOutlined />}
              >
                Descargar esta versi??n
              </Button>
            </Box>
          )}
        </Card>
        {versionToShow?.fileSource ? (
          <DocumentViewer uri={versionToShow.fileSource} />
        ) : (
          <Box my={60}>
            <Empty description="Este documento no tiene ninguna versi??n disponible" />
          </Box>
        )}
        {data.document.versions.info.count > 0 && (
          <Card>
            {data.document.categories.length > 0 && (
              <>
                <Title style={{ marginBottom: 10 }} level={5}>
                  Categor??as
                </Title>
                {data.document.categories.map((category) => (
                  <Tag color="green" key={category}>
                    {documentCategories[category]}
                  </Tag>
                ))}
              </>
            )}
            <Divider style={{ margin: '12px 0' }} />
            <Box display="flex">
              <Title style={{ marginBottom: 10, marginRight: 'auto' }} level={5}>
                Aprobaciones
              </Title>
              <Button
                type="primary"
                size="small"
                onClick={() => toggleApproveModal(true)}
                disabled={hasApprovedThisVersion || !developmentRole.manager}
                icon={<CheckOutlined />}
              >
                {hasApprovedThisVersion ? 'Aprobado' : 'Aprobar'}
              </Button>
            </Box>
            {versionToShow?.approvedBy.length === 0 && (
              <Box my={60}>
                <Empty description="Esta versi??n no ha sido aprobada" />
              </Box>
            )}
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
