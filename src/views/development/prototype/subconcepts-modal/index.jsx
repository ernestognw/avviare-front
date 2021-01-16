import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Drawer, List, Input, Button, Tooltip, Avatar, Typography, Tag } from 'antd';
import { useDebounce } from 'use-debounce';
import { searchableFields, units } from '@config/constants/subconcept';
import { useDevelopment } from '@providers/development';
import { useQuery } from '@apollo/client';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import Box from '@components/box';
import { GET_SUBCONCEPTS } from './requests';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const { Search } = Input;
const { Text, Paragraph } = Typography;

const SubconceptsModal = ({ concept, onClose, visible }) => {
  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState('');

  const { developmentRole } = useDevelopment();
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    setParams(defaultParams);
  }, [visible]);

  const { data, loading } = useQuery(GET_SUBCONCEPTS, {
    variables: {
      concept: {
        eq: concept.id,
      },
      params,
      search: searchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedSearch;
        return acc;
      }, {}),
    },
    skip: !visible,
  });

  return (
    <>
      <Drawer
        title={`Subconceptos de ${concept.name}`}
        width={600}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Box display="flex">
          <Search
            allowClear
            placeholder="Buscar subconceptos"
            onChange={({ target: { value } }) => setSearch(value)}
          />
          <Button
            style={{ margin: 'auto 10px auto 10px' }}
            type="primary"
            disabled={!developmentRole.manager}
            icon={<PlusOutlined />}
          >
            Añadir
          </Button>
        </Box>
        <List
          style={{ marginTop: 20 }}
          itemLayout="horizontal"
          dataSource={data?.subconcepts.results}
          loading={loading}
          pagination={{
            current: params.page,
            defaultCurrent: defaultParams.page,
            pageSize: params.pageSize,
            defaultPageSize: defaultParams.pageSize,
            total: data?.subconcepts.info.count,
            showTotal: (total) => `${total} subconceptos`,
            showSizeChanger: true,
            onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
            onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
          }}
          renderItem={({
            subconceptInstancesCount,
            code,
            name,
            description,
            quantity,
            unit,
            unitPrice,
          }) => (
            <List.Item
              actions={[
                <Button icon={<EditOutlined />} type="link">
                  Editar
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Tooltip placement="left" title={`${subconceptInstancesCount} instancias`}>
                    <Avatar size={40}>{subconceptInstancesCount}</Avatar>
                  </Tooltip>
                }
                title={
                  <>
                    <Text strong>{name}</Text>
                    <Tag style={{ marginLeft: 5 }} color="green">
                      {code}
                    </Tag>
                  </>
                }
                description={
                  <>
                    <Paragraph style={{ marginBottom: 2 }} type="secondary">
                      {description}
                    </Paragraph>
                    <Tag style={{}} color="blue">
                      {quantity} {units[unit]}(s)
                    </Tag>
                    <Tag style={{}} color="blue">
                      ${unitPrice}MXN/
                      {units[unit]}
                    </Tag>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};

SubconceptsModal.propTypes = {
  concept: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default SubconceptsModal;
