import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { useDebounce } from 'use-debounce';
import { useDevelopment } from '@providers/development';
import { NumberOutlined } from '@ant-design/icons';
import { searchableFields as allotmentPrototypeSearchableFields } from '@config/constants/allotment-prototype';
import { searchableFields as blockSearchableFields } from '@config/constants/block';
import { Form, Input, Button, Select } from 'antd';
import { GET_BLOCKS, GET_ALLOTMENT_PROTOTYPES } from './requests';

const params = {
  page: 1,
  pageSize: 5,
};

const { Item } = Form;
const { Option } = Select;

const AllotmentForm = ({ onFinish, loading, form, initialValues, disabled, ...props }) => {
  const [blockSearch, setBlockSearch] = useState('');
  const [allotmentPrototypeSearch, setAllotmentPrototypeSearch] = useState('');

  const [debouncedBlockSearch] = useDebounce(blockSearch, 500);
  const [debouncedAllotmentPrototypeSearch] = useDebounce(allotmentPrototypeSearch, 500);

  const { development } = useDevelopment();

  useEffect(() => {
    form.resetFields();
    setBlockSearch('');
    setAllotmentPrototypeSearch('');
  }, [form]);

  const { data: blocksData, loading: loadingBlocks } = useQuery(GET_BLOCKS, {
    variables: {
      development: {
        eq: development.id,
      },
      params,
      search: blockSearchableFields.reduce((acc, curr) => {
        acc[curr] = debouncedBlockSearch;
        return acc;
      }, {}),
    },
    skip: !development.id,
  });

  const { data: allotmentPrototypesData, loading: loadingAllotmentPrototypes } = useQuery(
    GET_ALLOTMENT_PROTOTYPES,
    {
      variables: {
        development: {
          eq: development.id,
        },
        params,
        search: allotmentPrototypeSearchableFields.reduce((acc, curr) => {
          acc[curr] = debouncedAllotmentPrototypeSearch;
          return acc;
        }, {}),
      },
      skip: !development.id,
    }
  );

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      form={form}
      initialValues={initialValues}
      {...props}
    >
      <Item
        label="Número de lote"
        name="number"
        rules={[{ required: true, message: 'Ingresa el nombre de lote' }]}
      >
        <Input prefix={<NumberOutlined />} placeholder="Número" disabled={disabled.number} />
      </Item>
      <Item
        label="Manzana"
        name="block"
        rules={[{ required: true, message: 'Selecciona una manzana' }]}
      >
        <Select
          placeholder="Selecciona una manzana"
          loading={loadingBlocks}
          onSearch={setBlockSearch}
          filterOption={false}
          showSearch
          disabled={disabled.block}
        >
          {blocksData?.blocks.results.map(({ id, number }) => (
            <Option key={id} value={id}>
              {number}
            </Option>
          ))}
        </Select>
      </Item>
      <Item
        label="Prototipo"
        name="allotmentPrototype"
        rules={[{ required: true, message: 'Selecciona una prototipo' }]}
      >
        <Select
          placeholder="Selecciona un prototipo"
          loading={loadingAllotmentPrototypes}
          onSearch={setAllotmentPrototypeSearch}
          filterOption={false}
          showSearch
          disabled={disabled.allotmentPrototype}
        >
          {allotmentPrototypesData?.allotmentPrototypes.results.map(({ id, name }) => (
            <Option key={id} value={id}>
              {name}
            </Option>
          ))}
        </Select>
      </Item>
      <Item style={{ marginTop: 20 }}>
        <Button
          loading={loading}
          style={{ display: 'block', marginLeft: 'auto' }}
          type="primary"
          htmlType="submit"
        >
          Guardar
        </Button>
      </Item>
    </Form>
  );
};

AllotmentForm.defaultProps = {
  form: null,
  initialValues: null,
  disabled: {
    number: false,
    block: false,
    allotmentPrototype: false,
  },
};

AllotmentForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  form: PropTypes.object,
  initialValues: PropTypes.shape({
    number: PropTypes.string,
    block: PropTypes.string,
    allotmentPrototype: PropTypes.string,
  }),
  disabled: PropTypes.shape({
    number: PropTypes.bool,
    block: PropTypes.bool,
    allotmentPrototype: PropTypes.bool,
  }),
};

export default AllotmentForm;
