import { Card, Table, Tag, Button, Avatar, Tooltip, Typography } from 'antd';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { join } from 'path';
import { documentCategories } from '@config/constants/document';
import theme from '@config/theme';
import moment from 'moment';
import {
  RightOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { ActionsContainer } from './elements';

const { Text } = Typography;

const DocumentsTable = ({ loading, download, pagination, documents, title, setDocumentEditId }) => {
  const { pathname } = useLocation();

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Categorías',
      dataIndex: 'categories',
      key: 'categories',
      render: (innerCategories) =>
        innerCategories.map((category) => (
          <Tag color="green" key={category}>
            {documentCategories[category]}
          </Tag>
        )),
    },
    {
      title: 'Versiones',
      dataIndex: 'versions',
      key: 'versions',
      render: (versions) => versions.info.count,
    },
    {
      title: 'Última versión aprobada por',
      width: 200,
      dataIndex: 'lastVersion',
      key: 'lastVersion',
      render: (lastVersion) =>
        lastVersion?.approvedBy.length > 0 ? (
          <Avatar.Group
            style={{ marginTop: 20 }}
            maxCount={5}
            maxStyle={{ backgroundColor: theme.colors.primary }}
          >
            {/* eslint-disable-next-line react/prop-types */}
            {lastVersion?.approvedBy.map(({ user, approvalDate }) => (
              <Tooltip
                key={user.id}
                title={`${user.firstName} ${user.lastName} aprobó el ${moment(approvalDate).format(
                  'lll'
                )}`}
                placement="top"
              >
                <Avatar src={user.profileImg}>{user.firstName[0]}</Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        ) : (
          <Text>Nadie</Text>
        ),
    },
    {
      title: 'Versión final aprobada por',
      width: 200,
      dataIndex: 'finalVersion',
      key: 'finalVersion',
      render: (finalVersion) =>
        finalVersion?.approvedBy.length > 0 ? (
          <Avatar.Group
            style={{ marginTop: 20 }}
            maxCount={5}
            maxStyle={{ backgroundColor: theme.colors.primary }}
          >
            {finalVersion?.approvedBy.map(({ user, approvalDate }) => (
              <Tooltip
                key={user.id}
                title={`${user.firstName} ${user.lastName} aprobó el ${moment(approvalDate).format(
                  'lll'
                )}`}
                placement="top"
              >
                <Avatar src={user.profileImg}>{user.firstName[0]}</Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        ) : (
          <Text>Nadie</Text>
        ),
    },
    {
      title: 'Acciones',
      fixed: 'right',
      render: (document) => (
        <ActionsContainer>
          <Link to={join(pathname, document.id)}>
            <Button type="primary" icon={<RightOutlined />} size="small">
              Ver
            </Button>
          </Link>
          <Tooltip title="Descargar versión final">
            <Button
              onClick={() =>
                download({
                  fileSource: document.finalVersion.fileSource,
                  name: document.name,
                  version: document.finalVersion.version,
                })
              }
              disabled={!document.finalVersion}
              style={{ marginLeft: 10 }}
              icon={<CheckCircleOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Descargar última versión">
            <Button
              onClick={() =>
                download({
                  fileSource: document.lastVersion.fileSource,
                  name: document.name,
                  version: document.lastVersion.version,
                })
              }
              disabled={!document.lastVersion}
              style={{ marginLeft: 10 }}
              icon={<ClockCircleOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Editar documento">
            <Button
              style={{ marginLeft: 10 }}
              onClick={() => setDocumentEditId(document.id)}
              icon={<EditOutlined />}
              size="small"
            />
          </Tooltip>
        </ActionsContainer>
      ),
    },
  ];

  return (
    <Card style={{ width: '100%', padding: 0 }}>
      <Table
        loading={loading}
        columns={columns}
        title={title}
        scroll={{
          x: true,
        }}
        rowKey="id"
        pagination={{ ...pagination, style: { marginRight: 20 } }}
        dataSource={documents}
      />
    </Card>
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

DocumentsTable.defaultProps = {
  documents: [],
};

DocumentsTable.propTypes = {
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

export default DocumentsTable;
