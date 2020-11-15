import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { useDevelopment } from '@providers/development';
import { Card, Table, Tag, Button, Avatar, Tooltip, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { searchableFields, documentCategories } from '@config/constants/document';
import theme from '@config/theme';
import { GET_DOCUMENTS } from './requests';
import { Container, ActionsContainer } from './elements';
import Title from './title';
import CreateDocumentModal from './create-document-modal';

const { Text } = Typography;

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Documents = () => {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [isOpenCreateDocumentModal, toggleCreateDocumentModal] = useState(false);
  const [params, setParams] = useState(defaultParams);
  const { development } = useDevelopment();
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, loading, refetch } = useQuery(GET_DOCUMENTS, {
    variables: {
      params,
      search: searchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedSearch;
        return acc;
      }, {}),
      development: {
        in: [development.id],
      },
      categories:
        categories.length > 0
          ? {
              in: categories,
            }
          : undefined,
    },
  });

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
      // eslint-disable-next-line react/prop-types
      render: (lastVersion) =>
        // eslint-disable-next-line react/prop-types
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
      title: 'Acciones',
      fixed: 'right',
      // eslint-disable-next-line react/prop-types
      render: () => (
        <ActionsContainer>
          <Button type="primary" icon={<RightOutlined />} size="small">
            Ver
          </Button>
        </ActionsContainer>
      ),
    },
  ];

  return (
    <>
      <Container>
        <Card style={{ width: '100%', padding: 0 }}>
          <Table
            loading={loading}
            columns={columns}
            title={() => (
              <Title
                setCategories={setCategories}
                setSearch={setSearch}
                openCreateDocumentModal={() => toggleCreateDocumentModal(true)}
              />
            )}
            scroll={{
              x: true,
            }}
            rowKey="id"
            pagination={{
              current: params.page,
              defaultCurrent: defaultParams.page,
              pageSize: params.pageSize,
              defaultPageSize: defaultParams.pageSize,
              total: data?.documents.info.count,
              showTotal: (total) => `${total} usuarios`,
              showSizeChanger: true,
              onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
              onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
            }}
            dataSource={data?.documents.results}
          />
        </Card>
      </Container>
      <CreateDocumentModal
        visible={isOpenCreateDocumentModal}
        onClose={() => toggleCreateDocumentModal(false)}
        updateDocuments={refetch}
      />
    </>
  );
};

export default Documents;
