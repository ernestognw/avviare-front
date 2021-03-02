import { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Steps, Button, message } from 'antd';
import Box from '@components/box';
import { useMutation } from '@apollo/client';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useDevelopment } from '@providers/development';
import AdvancementsTable from './advancements-table';
import InfoForm from './info-form';
import { CREATE_WORKLOAD } from './requests';

const { Step } = Steps;

const CreateWorkloadModal = ({ onClose, visible, reloadWorkloads }) => {
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState(0);
  const [advancements, setAdvancements] = useState([]);
  const [provider, setProvider] = useState('');
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [createWorkload] = useMutation(CREATE_WORKLOAD);

  const { development } = useDevelopment();

  const resetFields = () => {
    setCurrent(0);
    setAdvancements([]);
    setProvider('');
    setStart();
    setEnd();
  };

  const submit = async () => {
    setSaving(true);

    const { errors } = await createWorkload({
      variables: { workload: { development: development.id, provider, start, end, advancements } },
    });
    if (errors) {
      message.error(errors[0].message);
    } else {
      await reloadWorkloads();
      onClose();
      message.success('La estiumación ha sido creada correctamente');
      resetFields();
    }

    setSaving(false);
  };

  const handlePrevious = () => {
    if (current === 0) onClose();
    else setCurrent((curr) => curr - 1);
  };

  const handleNext = () => {
    if (current === 2) submit();
    else setCurrent((curr) => curr + 1);
  };

  const disabled1 = current === 0 && (!start || !end || !provider);
  const disabled2 = current === 1 && advancements.length === 0;

  const nextDisabled = disabled1 || disabled2;

  return (
    <Drawer
      footer={
        <Box textAlign="right">
          <Button onClick={handlePrevious} style={{ marginRight: 8 }}>
            {current === 0 ? 'Cancelar' : 'Atrás'}
          </Button>
          <Button disabled={nextDisabled || saving} onClick={handleNext} type="primary">
            {current === 2 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </Box>
      }
      title="Crear estimación"
      width={current === 0 ? '60%' : '90%'}
      onClose={onClose}
      visible={visible}
    >
      <Steps current={current}>
        <Step title="Básicos" description="Información básica de la estimación" />
        <Step title="Avances" description="Selecciona avances por proveedor" />
        <Step title="Confirmación" description="This is a description." />
      </Steps>
      {current === 0 && (
        <InfoForm
          provider={provider}
          setProvider={setProvider}
          start={start}
          setStart={setStart}
          end={end}
          setEnd={setEnd}
        />
      )}
      {current === 1 && (
        <Box display="flex">
          <AdvancementsTable
            title="Avances disponibles"
            provider={provider}
            extraAction={({ advancement: { id } }) => (
              <Button
                style={{ marginLeft: 5 }}
                onClick={() => setAdvancements((prev) => [...prev, id])}
                icon={<PlusOutlined />}
                size="small"
              />
            )}
            id={{
              nin: advancements,
            }}
            width="49%"
            mr="1%"
          />
          <AdvancementsTable
            title="Avances seleccionados"
            provider={provider}
            extraAction={({ advancement: { id } }) => (
              <Button
                style={{ marginLeft: 5 }}
                onClick={() =>
                  setAdvancements((prev) => prev.filter((advancement) => advancement !== id))
                }
                type="danger"
                icon={<CloseOutlined />}
                size="small"
              />
            )}
            id={{
              in: advancements,
            }}
            width="49%"
            ml="1%"
          />
        </Box>
      )}
      {current === 2 && (
        <Box>
          <InfoForm
            provider={provider}
            setProvider={setProvider}
            start={start}
            setStart={setStart}
            end={end}
            setEnd={setEnd}
            disabled
          />
          <AdvancementsTable
            mt={20}
            title="Resumen de avances"
            provider={provider}
            id={{
              in: advancements,
            }}
          />
        </Box>
      )}
    </Drawer>
  );
};

CreateWorkloadModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  reloadWorkloads: PropTypes.func.isRequired,
};

export default CreateWorkloadModal;
