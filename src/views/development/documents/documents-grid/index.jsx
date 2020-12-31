import { Card, Button, Avatar, Tooltip, Pagination, Typography, Divider, Tag } from 'antd';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { documentCategories } from '@config/constants/document';
import urljoin from 'url-join';
import Box from '@components/box';
import moment from 'moment';
import Loading from '@components/loading';
import theme from '@config/theme';
import {
  RightOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { DocumentsContainer } from './elements';

const { Meta } = Card;
const { Paragraph } = Typography;

const fileIcon = (fileName) => {
  const splittedFile = fileName.split('.');
  const ext = splittedFile[splittedFile.length - 1];
  if (ext.includes('doc')) return `/images/files/file-doc.svg`;
  if (ext.includes('xls')) return `/images/files/file-xls.svg`;
  if (ext.includes('ppt')) return `/images/files/file-ppt.svg`;
  if (ext.includes('pdf')) return `/images/files/file-pdf.svg`;
  return `/images/files/file-generic.svg`;
};

const DocumentsGrid = ({
  loading,
  download,
  pagination,
  documents,
  title: Title,
  setDocumentEditId,
}) => {
  const { pathname } = useLocation();

  return (
    <Box display="flex" flexDirection="column" width="100%">
      <Card>
        <Title />
      </Card>
      {loading ? (
        <Box display="flex" m={40} justifyContent="center" width="100%">
          <Loading />
        </Box>
      ) : (
        <DocumentsContainer>
          {documents?.map(({ id, name, description, finalVersion, lastVersion, categories }) => (
            <Card
              key={id}
              actions={[
                <Tooltip title="Descargar versión final">
                  <Button
                    onClick={() =>
                      download({
                        fileSource: finalVersion.fileSource,
                        name,
                        version: finalVersion.version,
                      })
                    }
                    disabled={!finalVersion}
                    style={{ marginLeft: 10 }}
                    icon={<CheckCircleOutlined />}
                    size="small"
                    type="link"
                  />
                </Tooltip>,
                <Tooltip title="Descargar última versión">
                  <Button
                    onClick={() =>
                      download({
                        fileSource: lastVersion.fileSource,
                        name,
                        version: lastVersion.version,
                      })
                    }
                    disabled={!lastVersion}
                    style={{ marginLeft: 10 }}
                    icon={<ClockCircleOutlined />}
                    size="small"
                    type="link"
                  />
                </Tooltip>,
                <Tooltip title="Editar documento">
                  <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => setDocumentEditId(id)}
                    icon={<EditOutlined />}
                    size="small"
                    type="link"
                  />
                </Tooltip>,
                <Link to={urljoin(pathname, id)}>
                  <Button type="link" icon={<RightOutlined />} size="small">
                    Ver
                  </Button>
                </Link>,
              ]}
            >
              <Meta
                avatar={
                  <Avatar
                    size={45}
                    src={fileIcon(finalVersion?.fileSource || lastVersion?.fileSource || '')}
                  />
                }
                style={{ marginBottom: 20 }}
                title={name}
                description={description}
              />
              {categories.length > 0 && (
                <Box display="flex" mb={20}>
                  {categories.map((category) => (
                    <Tag color="green" key={category}>
                      {documentCategories[category]}
                    </Tag>
                  ))}
                </Box>
              )}
              {finalVersion?.approvedBy.length > 0 && (
                <>
                  <Divider style={{ margin: '5px 0' }} />
                  <Paragraph style={{ margin: 0 }} type="secondary">
                    Versión final aprobada por:
                  </Paragraph>
                  <Avatar.Group maxCount={5} maxStyle={{ backgroundColor: theme.colors.primary }}>
                    {finalVersion?.approvedBy.map(({ user, approvalDate }) => (
                      <Tooltip
                        key={user.id}
                        title={`${user.firstName} ${user.lastName} aprobó el ${moment(
                          approvalDate
                        ).format('lll')}`}
                        placement="top"
                      >
                        <Avatar src={user.profileImg}>{user.firstName[0]}</Avatar>
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                </>
              )}
              {lastVersion?.approvedBy.length > 0 && (
                <>
                  <Divider style={{ margin: '5px 0' }} />
                  <Paragraph style={{ margin: 0 }} type="secondary">
                    Última versión aprobada por:
                  </Paragraph>
                  <Avatar.Group maxCount={5} maxStyle={{ backgroundColor: theme.colors.primary }}>
                    {lastVersion?.approvedBy.map(({ user, approvalDate }) => (
                      <Tooltip
                        key={user.id}
                        title={`${user.firstName} ${user.lastName} aprobó el ${moment(
                          approvalDate
                        ).format('lll')}`}
                        placement="top"
                      >
                        <Avatar src={user.profileImg}>{user.firstName[0]}</Avatar>
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                </>
              )}
            </Card>
          ))}
        </DocumentsContainer>
      )}
      <Pagination style={{ textAlign: 'center', marginTop: 20 }} {...pagination} />
    </Box>
  );
};

const versionPropTypes = PropTypes.shape({
  id: PropTypes.string,
  version: PropTypes.number,
  fileSource: PropTypes.string,
  approvedBy: PropTypes.arrayOf(
    PropTypes.shape({
      approvalDate: PropTypes.any.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        profileImg: PropTypes.string,
      }),
    })
  ),
});

DocumentsGrid.defaultProps = {
  documents: [],
};

DocumentsGrid.propTypes = {
  download: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.shape({
    current: PropTypes.number,
    pageSize: PropTypes.number,
    defaultPageSize: PropTypes.number,
    total: PropTypes.number,
    showTotal: PropTypes.func,
    showSizeChanger: PropTypes.bool,
    onChange: PropTypes.func,
    onShowSizeChange: PropTypes.func,
  }).isRequired,
  title: PropTypes.func.isRequired,
  setDocumentEditId: PropTypes.func.isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
      categories: PropTypes.arrayOf(PropTypes.string),
      versions: PropTypes.shape({
        info: PropTypes.shape({
          count: PropTypes.number,
        }),
      }),
      finalVersion: versionPropTypes,
      lastVersion: versionPropTypes,
    })
  ),
};

export default DocumentsGrid;
