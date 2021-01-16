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
} from 'antd';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { useDevelopment } from '@providers/development';
import Box from '@components/box';
import Loading from '@components/loading';
import { searchableFields } from '@config/constants/concept';
import { EditOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
import { GET_ALLOTMENT_PROTOTYPE, GET_CONCEPTS } from './requests';
import { Container, ConceptsContainer, EmptyContainer } from './elements';
import SubconceptsModal from './subconcepts-modal';
import CreateConceptModal from './create-concept-modal';

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
  const { developmentRole } = useDevelopment();
  const [isCreateConceptModalOpen, toggleCreateConceptModal] = useState(false);
  const [search, setSearch] = useState('');
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
      <Container>
        {loadingAllotment ? (
          <Skeleton
            avatar={{ size: 65 }}
            paragraph={{ rows: 1, style: { width: 400 } }}
            title={{ style: { width: 200 } }}
            active
          />
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
          <Box display="flex" m={40} justifyContent="center" width="100%">
            <Loading />
          </Box>
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
              {conceptsData.concepts.results.map(({ id, name, description, subconceptsCount }) => (
                <Card
                  key={id}
                  actions={[
                    <Tooltip title="Editar concepto">
                      <Button
                        style={{ marginLeft: 10 }}
                        icon={<EditOutlined />}
                        size="small"
                        type="link"
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
                      <Tooltip title={`${subconceptsCount} subconceptos`}>
                        <Avatar size={40}>{subconceptsCount}</Avatar>
                      </Tooltip>
                    }
                    title={name}
                    description={description}
                  />
                </Card>
              ))}
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
      />
      <CreateConceptModal
        visible={isCreateConceptModalOpen}
        onClose={() => toggleCreateConceptModal(false)}
        updateConcepts={refetchConcepts}
      />
    </>
  );
};

export default Prototype;
