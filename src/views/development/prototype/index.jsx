import { useState } from 'react';
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
  Breadcrumb,
  Progress,
} from 'antd';
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import shortid from 'shortid';
import { useDebounce } from 'use-debounce';
import { useDevelopment } from '@providers/development';
import Box from '@components/box';
import { searchableFields } from '@config/constants/concept';
import { EditOutlined, RightOutlined, PlusOutlined, BlockOutlined } from '@ant-design/icons';
import { GET_ALLOTMENT_PROTOTYPE, GET_CONCEPTS } from './requests';
import { Container, ConceptsContainer, EmptyContainer } from './elements';
import SubconceptsModal from './subconcepts-modal';
import CreateConceptModal from './create-concept-modal';
import EditConceptModal from './edit-concept-modal';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;

const defaultParams = {
  page: 1,
  pageSize: 20,
};

const Prototype = () => {
  const [params, setParams] = useState(defaultParams);
  const { allotmentPrototypeId } = useParams();
  const { developmentRole, development } = useDevelopment();
  const [isCreateConceptModalOpen, toggleCreateConceptModal] = useState(false);
  const [search, setSearch] = useState('');
  const [conceptEditId, setConceptEditId] = useState('');
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: allotmentData, loading: loadingAllotment } = useQuery(GET_ALLOTMENT_PROTOTYPE, {
    variables: { id: allotmentPrototypeId },
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
        allotmentPrototype: {
          eq: allotmentPrototypeId,
        },
      },
    }
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
            <Link to={`/development/${development.id}/prototypes`}>Prototipos</Link>
          </Breadcrumb.Item>
          {!loadingAllotment && (
            <Breadcrumb.Item>{allotmentData.allotmentPrototype.name}</Breadcrumb.Item>
          )}
        </Breadcrumb>
      </Box>
      <Container>
        {loadingAllotment ? (
          <Skeleton title={{ style: { width: 200 } }} active paragraph={false} />
        ) : (
          <Box display="flex">
            <Title style={{ margin: 0 }} level={3}>
              {allotmentData.allotmentPrototype.name}
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
              onClick={() => toggleCreateConceptModal(true)}
            >
              Añadir
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
                    <Text>Este prototipo no tiene conceptos. Comienza añadiendo alguno</Text>
                  </>
                ),
              }}
            />
          </EmptyContainer>
        ) : (
          <>
            <ConceptsContainer>
              {conceptsData.concepts.results.map(
                ({ id, name, code, description, progress, subconcepts }) => (
                  <Card
                    key={id}
                    actions={[
                      <Tooltip title="Editar concepto">
                        <Button
                          style={{ marginLeft: 10 }}
                          icon={<EditOutlined />}
                          size="small"
                          type="link"
                          onClick={() => setConceptEditId(id)}
                        />
                      </Tooltip>,
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
                        <Tooltip title={`${subconcepts.info.count} subconceptos`}>
                          <Avatar size={40}>{subconcepts.info.count}</Avatar>
                        </Tooltip>
                      }
                      title={
                        <>
                          <Title level={5}>{name}</Title>
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
      <SubconceptsModal
        concept={selectedConcept ?? {}}
        visible={!!selectedConcept}
        onClose={() => setSelectedConcept(null)}
        onSubconceptAdded={refetchConcepts}
      />
      <CreateConceptModal
        visible={isCreateConceptModalOpen}
        onClose={() => toggleCreateConceptModal(false)}
        updateConcepts={refetchConcepts}
      />
      <EditConceptModal
        visible={!!conceptEditId}
        conceptEditId={conceptEditId}
        onClose={() => setConceptEditId('')}
      />
    </>
  );
};

export default Prototype;
