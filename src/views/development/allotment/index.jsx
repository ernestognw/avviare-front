import { useState, useMemo } from 'react';
import {
  Typography,
  Skeleton,
  Card,
  Pagination,
  Empty,
  Input,
  Tooltip,
  Avatar,
  Button,
  Tag,
  Progress,
  Breadcrumb,
} from 'antd';
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import shortid from 'shortid';
import { useDebounce } from 'use-debounce';
import { useDevelopment } from '@providers/development';
import Box from '@components/box';
import { searchableFields } from '@config/constants/concept';
import { RightOutlined, PlusOutlined, BlockOutlined } from '@ant-design/icons';
import { GET_ALLOTMENT, GET_CONCEPTS } from './requests';
import { Container, ConceptsContainer, EmptyContainer } from './elements';
import SubconceptInstancesModal from './subconcept-instances-modal';
import AddSubconceptInstanceModal from './add-subconcept-instance-modal';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Allotment = () => {
  const [params, setParams] = useState(defaultParams);
  const { allotmentId } = useParams();
  const { developmentRole, development } = useDevelopment();
  const [search, setSearch] = useState('');
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [isAddSubconceptInstanceModalOpen, toggleAddSubconceptInstanceModal] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: allotmentData, loading: loadingAllotment } = useQuery(GET_ALLOTMENT, {
    variables: { id: allotmentId },
  });

  const { data: conceptsData, loading: loadingConcepts, refetch: refetchConcepts } = useQuery(
    GET_CONCEPTS,
    {
      variables: {
        search: searchableFields.reduce((acc, curr) => {
          acc[curr] = debouncedSearch;
          return acc;
        }, {}),
        params,
        allotment: {
          eq: allotmentId,
        },
      },
    }
  );

  const subconceptsTaken = useMemo(
    () =>
      conceptsData?.concepts.results
        .map(({ subconceptInstances }) =>
          subconceptInstances.results.map(({ subconcept }) => subconcept.id)
        )
        .flat(),
    [conceptsData]
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
            <Link to={`/development/${development.id}/allotments`}>Lotes</Link>
          </Breadcrumb.Item>
          {!loadingAllotment && <Breadcrumb.Item>{allotmentData.allotment.number}</Breadcrumb.Item>}
        </Breadcrumb>
      </Box>
      <Container>
        {loadingAllotment ? (
          <Skeleton title={{ style: { width: 200 } }} active paragraph={false} />
        ) : (
          <Box display="flex">
            <Title style={{ margin: 0 }} level={3}>
              Lote {allotmentData.allotment.number}
            </Title>
            <Search
              style={{ width: 250, margin: 'auto 10px auto auto' }}
              allowClear
              placeholder="Buscar conceptos"
              onChange={({ target: { value } }) => setSearch(value)}
            />
            <Button
              style={{ margin: 'auto 10px' }}
              type="primary"
              icon={<PlusOutlined />}
              disabled={!developmentRole.manager}
              onClick={() => toggleAddSubconceptInstanceModal(true)}
            >
              Añadir instancia
            </Button>
          </Box>
        )}
        {loadingConcepts ? (
          <ConceptsContainer>
            {new Array(10).fill().map(() => (
              <Card key={shortid.generate()}>
                <Skeleton active loading paragraph={{ rows: 1 }} />
              </Card>
            ))}
          </ConceptsContainer>
        ) : conceptsData.concepts.results.length === 0 ? (
          <EmptyContainer>
            <Empty
              empty={{
                description: (
                  <>
                    <Text strong>No hay resultados</Text>
                    <br />
                    <Text>Este lote no tiene subconceptos. Comienza añadiendo alguno</Text>
                  </>
                ),
              }}
            />
          </EmptyContainer>
        ) : (
          <>
            <ConceptsContainer>
              {conceptsData.concepts.results.map(
                ({ id, name, code, description, progress, subconceptInstances }) => (
                  <Card
                    key={id}
                    actions={[
                      <Button
                        onClick={() => setSelectedConcept({ id, name })}
                        type="link"
                        icon={<RightOutlined />}
                        size="small"
                      >
                        Ver
                      </Button>,
                    ]}
                  >
                    <Meta
                      avatar={
                        <Tooltip
                          title={`${subconceptInstances.info.count} instancias de subconcepto`}
                        >
                          <Avatar size={40}>{subconceptInstances.info.count}</Avatar>
                        </Tooltip>
                      }
                      title={
                        <>
                          <Title level={5} style={{ marginBottom: 0 }}>
                            {name}
                          </Title>
                          <Box mr="15%">
                            <Progress size="small" percent={progress} />
                          </Box>
                          <Tag color="green">{code}</Tag>
                        </>
                      }
                      description={description}
                    />
                  </Card>
                )
              )}
            </ConceptsContainer>
            <Pagination
              style={{ textAlign: 'center', marginTop: 20 }}
              current={params.page}
              defaultCurrent={defaultParams.page}
              pageSize={params.pageSize}
              defaultPageSize={defaultParams.pageSize}
              total={conceptsData.concepts.info.count}
              showTotal={(total) => `${total} conceptos`}
              showSizeChanger
              onChange={(page, pageSize) => setParams({ ...params, page, pageSize })}
              onShowSizeChange={(page, pageSize) => setParams({ ...params, page, pageSize })}
            />
          </>
        )}
      </Container>
      <SubconceptInstancesModal
        concept={selectedConcept ?? {}}
        visible={!!selectedConcept}
        onClose={() => setSelectedConcept(null)}
      />
      <AddSubconceptInstanceModal
        subconceptsTaken={subconceptsTaken}
        allotmentPrototype={allotmentData?.allotment.allotmentPrototype.id}
        visible={isAddSubconceptInstanceModalOpen}
        onCancel={() => toggleAddSubconceptInstanceModal(false)}
        reloadConcepts={refetchConcepts}
      />
    </>
  );
};

export default Allotment;
