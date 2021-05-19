import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import CreditForm from '@components/credit-form';
import Box from '@components/box';
import Loading from '@components/loading';
import { GET_CREDIT, UPDATE_CREDIT } from './requests';

const EditCreditModal = ({ onClose, visible, creditEditId }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [updateCredit] = useMutation(UPDATE_CREDIT);
  const { loading, data } = useQuery(GET_CREDIT, {
    variables: {
      id: creditEditId,
    },
    skip: !creditEditId,
  });

  const onFinish = async ({ number, bank, end, defaultInterestRate, interestRate, addTIIE }) => {
    setSaving(true);
    const { errors } = await updateCredit({
      variables: {
        id: creditEditId,
        credit: {
          number,
          bank,
          end,
          defaultInterestRate,
          interestRate,
          addTIIE,
        },
      },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      onClose();
      message.success('Usuario actualizado con éxito');
    }

    setSaving(false);
  };

  return (
    <Drawer
      title="Crea un nuevo crédito"
      width={400}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      {loading ? (
        <Box display="flex" m={40} justifyContent="center" width="100%">
          <Loading />
        </Box>
      ) : (
        <CreditForm
          form={form}
          onFinish={onFinish}
          disabled={{
            type: true,
            TIIEDay: true,
            billingDay: true,
            paymentDay: true,
            development: true,
          }}
          loading={saving}
          initialValues={{ ...data?.credit }}
        />
      )}
    </Drawer>
  );
};

EditCreditModal.defaultProps = {
  creditEditId: '',
};

EditCreditModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  creditEditId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
};

export default EditCreditModal;
