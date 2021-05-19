import { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { NumberOutlined } from '@ant-design/icons';
import { Form, Input, Button, Select, DatePicker, InputNumber, Checkbox } from 'antd';
import { banks, types } from '@config/constants/credit';

const { Item } = Form;
const { Option } = Select;

const CreditForm = ({ onFinish, loading, form, initialValues, disabled, ...props }) => {
  useEffect(() => {
    form.resetFields();
  }, [form]);

  const handleOnFinish = (credit) => {
    const formattedCredit = { ...credit };

    if (credit.end) formattedCredit.end = moment(credit.end).format('yyyy-MM-DD');

    onFinish(formattedCredit);
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleOnFinish}
      form={form}
      initialValues={{
        ...initialValues,
        end: initialValues.end ? moment(initialValues.end) : undefined,
      }}
      {...props}
    >
      <Item
        label="Número"
        name="number"
        rules={[{ required: true, message: 'Ingresa el número del crédito' }]}
      >
        <Input disabled={disabled.number} prefix={<NumberOutlined />} placeholder="Número" />
      </Item>
      <Item
        label="Banco"
        name="bank"
        rules={[{ required: true, message: 'Ingresa el banco del crédito' }]}
      >
        <Select disabled={disabled.bank} placeholder="Banco">
          {Object.keys(banks).map((bank) => (
            <Option key={bank} value={bank}>
              {banks[bank]}
            </Option>
          ))}
        </Select>
      </Item>
      <Item
        label="Tipo de crédito"
        name="type"
        rules={[{ required: true, message: 'Ingresa el tipo del crédito' }]}
      >
        <Select disabled={disabled.type} placeholder="Banco">
          {Object.keys(types).map((type) => (
            <Option key={type} value={type}>
              {types[type]}
            </Option>
          ))}
        </Select>
      </Item>
      <Item
        label="Fecha de término"
        name="end"
        rules={[{ required: true, message: 'Ingresa la fecha de finalización de crédito' }]}
      >
        <DatePicker disabled={disabled.end} style={{ width: '100%' }} />
      </Item>
      <Item
        label="Días de TIIE"
        name="TIIEDay"
        rules={[{ required: true, message: 'Ingresa el día de TIIE para cada movimiento' }]}
      >
        <InputNumber
          disabled={disabled.TIIEDay}
          min={1}
          max={31}
          style={{ width: '100%' }}
          placeholder="Día de TIIE"
        />
      </Item>
      <Item
        label="Días de corte"
        name="billingDay"
        rules={[{ required: true, message: 'Ingresa el día de corte ' }]}
      >
        <InputNumber
          disabled={disabled.billingDay}
          min={1}
          max={31}
          style={{ width: '100%' }}
          placeholder="Día de corte"
        />
      </Item>
      <Item
        label="Días de pago"
        name="paymentDay"
        rules={[{ required: true, message: 'Ingresa el día de pago' }]}
      >
        <InputNumber
          disabled={disabled.billingDay}
          min={1}
          max={31}
          style={{ width: '100%' }}
          placeholder="Día de pago"
        />
      </Item>
      <Item
        label="Tasa de interés anual base"
        name="interestRate"
        rules={[{ required: true, message: 'Ingresa la tasa de interés' }]}
      >
        <InputNumber
          disabled={disabled.interestRate}
          min={0}
          step={0.01}
          style={{ width: '100%' }}
          placeholder="Tasa de interés anual base"
          formatter={(value) => `${value}%`}
          parser={(value) => value.replace('%', '')}
        />
      </Item>
      <Item
        label="Tasa de interés moratoria anual base"
        name="defaultInterestRate"
        rules={[{ required: true, message: 'Ingresa la tasa de interés moratoria' }]}
      >
        <InputNumber
          disabled={disabled.defaultInterestRate}
          min={0}
          step={0.01}
          style={{ width: '100%' }}
          placeholder="Tasa de interés moratoria anual base"
          formatter={(value) => `${value}%`}
          parser={(value) => value.replace('%', '')}
        />
      </Item>
      <Item name="addTIIE" valuePropName="checked" style={{ flexGrow: 1 }}>
        <Checkbox disabled={disabled.addTIIE}>Añadir TIIE a movimientos</Checkbox>
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

CreditForm.defaultProps = {
  disabled: {},
  form: null,
  initialValues: null,
};

CreditForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  form: PropTypes.object,
  initialValues: PropTypes.shape({
    number: PropTypes.string,
    bank: PropTypes.oneOf(Object.keys(banks)),
    type: PropTypes.oneOf(Object.keys(types)),
    end: PropTypes.any,
    TIIEDay: PropTypes.number,
    billingDay: PropTypes.number,
    paymentDay: PropTypes.number,
    development: PropTypes.string,
    interestRate: PropTypes.number,
    defaultInterestRate: PropTypes.number,
    addTIIE: PropTypes.bool,
  }),
  disabled: PropTypes.shape({
    number: PropTypes.bool,
    bank: PropTypes.bool,
    type: PropTypes.bool,
    end: PropTypes.bool,
    TIIEDay: PropTypes.bool,
    billingDay: PropTypes.bool,
    paymentDay: PropTypes.bool,
    development: PropTypes.bool,
    interestRate: PropTypes.bool,
    defaultInterestRate: PropTypes.bool,
    addTIIE: PropTypes.bool,
  }),
};

export default CreditForm;
