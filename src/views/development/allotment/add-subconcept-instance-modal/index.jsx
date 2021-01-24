import { useState, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { units } from '@config/constants/subconcept';
import { useParams } from 'react-router-dom';
import { Modal, Form, TreeSelect, Typography, Tag, Empty, message } from 'antd';
import Box from '@components/box';
import Loading from '@components/loading';
import { CREATE_SUBCONCEPT_INSTANCE, GET_CONCEPTS_AVAILABLE } from './requests';
import { EmptyContainer } from './elements';

const { Item } = Form;
const { TreeNode } = TreeSelect;
const { Text, Paragraph } = Typography;

const AddSubconceptInstanceModal = ({
  reloadConcepts,
  allotmentPrototype,
  visible,
  onCancel,
  subconceptsTaken,
}) => {
  const [adding, setAdding] = useState('');
  const { allotmentId } = useParams();
  const [form] = Form.useForm();

  const [createSubconceptInstance] = useMutation(CREATE_SUBCONCEPT_INSTANCE);

  const { data, loading } = useQuery(GET_CONCEPTS_AVAILABLE, {
    variables: {
      allotmentPrototype: {
        eq: allotmentPrototype,
      },
    },
    skip: !visible || !allotmentPrototype,
  });

  const addSubconceptInstance = async ({ subconcept }) => {
    setAdding(true);
    const { errors } = await createSubconceptInstance({
      variables: {
        subconceptInstance: { subconcept, allotment: allotmentId },
      },
    });

    if (errors) message.error(errors[0].message);
    else {
      onCancel();
      await reloadConcepts();
      form.resetFields();
      message.success('La instancia del subconcepto ha sido creada');
    }
    setAdding(false);
  };

  const onFinish = (subconceptInstance) =>
    Modal.confirm({
      title: '¿Quieres añadir este subconcepto?',
      content:
        'Una vez que lo agregues, no se podrá retirar este subconcepto de este lote, y afectará al cálculo de progreso. Asegúrate de que sea correcto',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => addSubconceptInstance(subconceptInstance),
    });

  const filteredConcepts = useMemo(() => {
    const filteredSubconcepts = data?.concepts.results.map((concept) => ({
      ...concept,
      subconcepts: {
        ...concept.subconcepts,
        results: concept.subconcepts.results.filter(({ id }) => !subconceptsTaken.includes(id)),
      },
    }));

    return filteredSubconcepts?.filter(({ subconcepts }) => !!subconcepts.results.length) ?? [];
  }, [subconceptsTaken, data]);

  return (
    <Modal
      title="Crea una instancia de subconcepto"
      visible={visible}
      onOk={filteredConcepts.length === 0 ? onCancel : form.submit}
      onCancel={onCancel}
      width="70%"
      confirmLoading={adding}
    >
      {loading || !visible ? (
        <Box display="flex" m={40} justifyContent="center" width="100%">
          <Loading />
        </Box>
      ) : filteredConcepts.length === 0 ? (
        <EmptyContainer>
          <Empty
            description={
              <>
                <Text strong>No hay conceptos disponibles</Text>
                <br />
                <Text>
                  Parece ser que este lote tiene instancias de todos los subconceptos de su
                  prototipo
                </Text>
              </>
            }
          />
        </EmptyContainer>
      ) : (
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Item
            label="Selecciona un subconcepto"
            name="subconcept"
            rules={[{ required: true, message: 'Selecciona un subconcepto' }]}
          >
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              placeholder="Selecciona un subconcepto"
            >
              {filteredConcepts.map(
                ({
                  id: conceptId,
                  code: conceptCode,
                  name: conceptName,
                  description: conceptDescription,
                  subconcepts: innerSubconcepts,
                }) => (
                  <TreeNode
                    key={conceptId}
                    value={conceptId}
                    selectable={false}
                    title={
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
                    }
                  >
                    {innerSubconcepts.results.map(
                      ({ id, code, name, description, quantity, unit, unitPrice }) => (
                        <TreeNode
                          key={id}
                          value={id}
                          title={
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
                          }
                        />
                      )
                    )}
                  </TreeNode>
                )
              )}
            </TreeSelect>
          </Item>
        </Form>
      )}
    </Modal>
  );
};

AddSubconceptInstanceModal.defaultProps = {
  subconceptsTaken: [],
  allotmentPrototype: '',
};

AddSubconceptInstanceModal.propTypes = {
  subconceptsTaken: PropTypes.arrayOf(PropTypes.string),
  allotmentPrototype: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  reloadConcepts: PropTypes.func.isRequired,
};

export default AddSubconceptInstanceModal;
