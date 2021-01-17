import { useMemo, useState, useEffect } from 'react';
import { Typography, Tree, Alert, Tag, Skeleton, Empty } from 'antd';
import PropTypes from 'prop-types';
import { units } from '@config/constants/subconcept';
import { useQuery } from '@apollo/client';
import { GET_AVAILABLE_CONCEPTS } from './requests';
import { EmptyContainer } from './elements';

const { Paragraph, Text } = Typography;

const SubconceptInstanceSelection = ({ allotmentPrototype, subconcepts, setSubconcepts }) => {
  const [treeValues, setTreeValues] = useState([]);

  const { data, loading } = useQuery(GET_AVAILABLE_CONCEPTS, {
    variables: {
      allotmentPrototype: {
        eq: allotmentPrototype,
      },
    },
  });

  // Used to filter only subconcepts
  const conceptsMap = useMemo(
    () =>
      (data?.concepts.results || []).reduce((acc, curr) => {
        acc[curr.id] = true;
        return acc;
      }, {}),
    [data?.concepts]
  );

  // I know it is not the best performant solution but there are not so many options around the tree config
  useEffect(() => setSubconcepts(treeValues.filter((value) => !conceptsMap[value])), [treeValues]);

  const treeData = useMemo(
    () =>
      (data?.concepts.results || []).map(
        ({
          id: conceptId,
          code: conceptCode,
          name: conceptName,
          description: conceptDescription,
          subconcepts: innerSubconcepts,
        }) => ({
          title: (
            <>
              <Text strong>{conceptName}</Text>
              <Tag style={{ marginLeft: 10 }} color="green">
                {conceptCode}
              </Tag>
              <Paragraph
                style={{ margin: 0 }}
                type="secondary"
                ellipsis={{ rows: 2, expandable: true, symbol: 'Más' }}
              >
                {conceptDescription}
              </Paragraph>
            </>
          ),
          key: conceptId,
          checkable: innerSubconcepts.info.count > 0,
          children: innerSubconcepts.results.map(
            ({ id, code, name, description, quantity, unit, unitPrice }) => ({
              title: (
                <>
                  <Text strong>{name}</Text>
                  <Tag style={{ marginLeft: 5 }} color="green">
                    {code}
                  </Tag>
                  <Paragraph
                    style={{ marginBottom: 2 }}
                    type="secondary"
                    ellipsis={{ rows: 2, expandable: true, symbol: 'Más' }}
                  >
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
              ),
              key: id,
            })
          ),
        })
      ),
    [data?.concepts]
  );

  return (
    <>
      <Paragraph>
        En base al prototipo elegido, puedes seleccionar todos los subconceptos que formarán parte
        de este lote en particular. Verifica los disponibles en la lista, y al finalizar, haz click
        en Confirmar
      </Paragraph>
      <Skeleton active={loading} loading={loading}>
        {treeData.length === 0 ? (
          <EmptyContainer>
            <Empty
              description={
                <>
                  <Text strong>No hay conceptos</Text>
                  <br />
                  <Text>
                    El prototipo seleccionado no tiene conceptos ni subconceptos configurados. Al
                    continuar aceptas que tendrás que añadirlos manualmente más adelante
                  </Text>
                </>
              }
            />
          </EmptyContainer>
        ) : (
          <>
            <Tree
              selectable={false}
              checkedKeys={subconcepts}
              checkable
              onCheck={(checked) => setTreeValues(checked)}
              treeData={treeData}
            />
            <Alert
              title="Cuidado"
              message="Antes de continuar, asegúrate que estás registrando los subconceptos correctos"
              type="info"
              showIcon
              style={{ marginTop: 10 }}
            />
          </>
        )}
      </Skeleton>
    </>
  );
};

SubconceptInstanceSelection.propTypes = {
  allotmentPrototype: PropTypes.string.isRequired,
  subconcepts: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSubconcepts: PropTypes.func.isRequired,
};

export default SubconceptInstanceSelection;
