import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Drawer, List, Input, Button, Tooltip, Avatar } from 'antd';
import { useDebounce } from 'use-debounce';
import { searchableFields } from '@config/constants/block';
import { useDevelopment } from '@providers/development';
import { useQuery } from '@apollo/client';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import Box from '@components/box';
import CreateBlockModal from './create-block-modal';
import EditBlockModal from './edit-block-modal';
import { GET_BLOCKS } from './requests';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const { Search } = Input;

const BlocksModal = ({ onClose, visible }) => {
  const [params, setParams] = useState(defaultParams);
  const [search, setSearch] = useState('');
  const [isOpenCreateBlockModal, toggleCreateBlockModal] = useState(false);
  const [blockEditId, setBlockEditId] = useState('');

  const { development, developmentRole } = useDevelopment();
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    setParams(defaultParams);
  }, [visible]);

  const { data, loading, refetch } = useQuery(GET_BLOCKS, {
    variables: {
      development: {
        eq: development.id,
      },
      params,
      search: searchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedSearch;
        return acc;
      }, {}),
    },
  });

  return (
    <>
      <Drawer
        title={`Manzanas de ${development.name}`}
        width={600}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Box display="flex">
          <Search
            allowClear
            placeholder="Buscar manzanas"
            onChange={({ target: { value } }) => setSearch(value)}
          />
          <Button
            style={{ margin: 'auto 10px auto 10px' }}
            type="primary"
            disabled={!developmentRole.manager}
            icon={<PlusOutlined />}
            onClick={() => toggleCreateBlockModal(true)}
          >
            Añadir
          </Button>
        </Box>
        <List
          style={{ marginTop: 20 }}
          itemLayout="horizontal"
          dataSource={data?.blocks.results}
          loading={loading}
          pagination={{
            current: params.page,
            defaultCurrent: defaultParams.page,
            pageSize: params.pageSize,
            defaultPageSize: defaultParams.pageSize,
            total: data?.blocks.info.count,
            showTotal: (total) => `${total} manzanas`,
            showSizeChanger: true,
            onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
            onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
          }}
          renderItem={({ id, allotmentsCount, createdAt, number }) => (
            <List.Item
              actions={[
                <Button onClick={() => setBlockEditId(id)} icon={<EditOutlined />} type="link">
                  Editar
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Tooltip placement="left" title={`${allotmentsCount} lotes en esta manzana`}>
                    <Avatar size={40}>{allotmentsCount}</Avatar>
                  </Tooltip>
                }
                title={number}
                description={`Creado el ${moment(createdAt).format('lll')}`}
              />
            </List.Item>
          )}
        />
      </Drawer>
      <CreateBlockModal
        visible={isOpenCreateBlockModal}
        onClose={() => toggleCreateBlockModal(false)}
        updateBlocks={refetch}
      />
      <EditBlockModal
        visible={!!blockEditId}
        blockEditId={blockEditId}
        onClose={() => setBlockEditId('')}
      />
    </>
  );
};

BlocksModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default BlocksModal;
