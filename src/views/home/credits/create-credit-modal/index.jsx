import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, message } from 'antd';
import { useMutation } from '@apollo/client';
import CreditForm from '@components/credit-form';
import { CREATE_CREDIT } from './requests';

const CreateCreditModal = ({ onClose, visible, updateCredits }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [createCredit] = useMutation(CREATE_CREDIT);

  const onFinish = async (credit) => {
    setSaving(true);

    const { errors } = await createCredit({ variables: { credit } });
    if (errors) {
      message.error(errors[0].message);
    } else {
      await updateCredits();
      onClose();
      form.resetFields();
      message.success('El crédito se ha creado correctamente');
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
      <CreditForm form={form} onFinish={onFinish} loading={saving} />
    </Drawer>
  );
};

CreateCreditModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateCredits: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateCreditModal;
