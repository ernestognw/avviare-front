import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Drawer, List, Typography, Tag, Progress } from 'antd';
import { units } from '@config/constants/subconcept';
import { useQuery } from '@apollo/client';
import { GET_SUBCONCEPT_INSTANCES } from './requests';

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const { Text, Paragraph } = Typography;

const SubconceptsModal = ({ concept, onClose, visible }) => {
  const [params, setParams] = useState(defaultParams);
  const { allotmentId } = useParams();

  useEffect(() => {
    setParams(defaultParams);
  }, [visible]);

  const { data, loading } = useQuery(GET_SUBCONCEPT_INSTANCES, {
    variables: {
      concept: {
        eq: concept.id,
      },
      allotment: {
        eq: allotmentId,
      },
      params,
    },
    skip: !visible,
  });

  return (
    <>
      <Drawer
        title={`Instancias de subconcepto de ${concept.name}`}
        width={600}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <List
          itemLayout="horizontal"
          dataSource={data?.subconceptInstances.results}
          loading={loading}
          pagination={{
            current: params.page,
            defaultCurrent: defaultParams.page,
            pageSize: params.pageSize,
            defaultPageSize: defaultParams.pageSize,
            total: data?.subconceptInstances.info.count,
            showTotal: (total) => `${total} instancias`,
            showSizeChanger: true,
            onChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
            onShowSizeChange: (page, pageSize) => setParams({ ...params, page, pageSize }),
          }}
          renderItem={({
            progress,
            subconcept: { code, name, description, quantity, unit, unitPrice },
          }) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Progress type="circle" percent={progress} width={80} />}
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
                    <Tag color="blue">
                      {quantity} {units[unit]}(s)
                    </Tag>
                    <Tag color="blue">
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
