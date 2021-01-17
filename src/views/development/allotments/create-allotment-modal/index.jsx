import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Form, Modal, message } from 'antd';
import { useMutation } from '@apollo/client';
import { useDevelopment } from '@providers/development';
import AllotmentForm from '@components/allotment-form';
import { CREATE_ALLOTMENT } from './requests';
import SubconceptInstanceSelection from './subconcept-instance-selection';

const CreateAllotmentModal = ({ onClose, visible, updateAllotments }) => {
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [createAllotment] = useMutation(CREATE_ALLOTMENT);
  const [allotmentPrototype, setAllotmentPrototype] = useState('');
  const [subconcepts, setSubconcepts] = useState([]);
  const { development } = useDevelopment();

  const saveAllotment = async (allotment) => {
    setSaving(true);

    const { errors } = await createAllotment({
      variables: { allotment: { development: development.id, ...allotment }, subconcepts },
    });
    if (errors) {
      message.error(errors[0].message);
    } else {
      await updateAllotments();
      onClose();
      form.resetFields();
      setAllotmentPrototype('');
      message.success('El lote ha sido creado correctamente');
    }

    setSaving(false);
  };

  const onFinish = (allotment) =>
    Modal.confirm({
      title: '¿Quieres guardar este lote?',
      content:
        'Una vez que lo guardes, no se podrá cambiar el prototipo ni se podrán borrar subconceptos que ya fueron asignados. Asegúrate que es el correcto',
      okText: 'Confirmar',
      cancelText: 'Cancelar',
      onOk: () => saveAllotment(allotment),
    });

  return (
    <Drawer
      title="Crear un lote"
      width={600}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <AllotmentForm
        onValuesChange={({ allotmentPrototype: allotmentPrototypeFormValue }) => {
          if (allotmentPrototypeFormValue && allotmentPrototypeFormValue !== allotmentPrototype)
            setAllotmentPrototype(allotmentPrototypeFormValue);
        }}
        form={form}
        loading={saving}
        onFinish={onFinish}
        after={
          allotmentPrototype && (
            <SubconceptInstanceSelection
              allotmentPrototype={allotmentPrototype}
              subconcepts={subconcepts}
              setSubconcepts={setSubconcepts}
            />
          )
        }
      />
    </Drawer>
  );
};

CreateAllotmentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateAllotments: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default CreateAllotmentModal;
