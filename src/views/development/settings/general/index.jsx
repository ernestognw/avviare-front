import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form, message } from 'antd';
import { useDevelopment } from '@providers/development';
import DevelopmentForm from '@components/development-form';
import Box from '@components/box';
import Loading from '@components/loading';
import { Container } from './elements';
import { UPDATE_DEVELOPMENT } from './requests';

const General = () => {
  const [saving, setSaving] = useState(false);
  const [updateDevelopment] = useMutation(UPDATE_DEVELOPMENT);
  const { development, loadingDevelopment, reloadDevelopment } = useDevelopment();
  const [form] = Form.useForm();

  const onFinish = async ({ name, logo, cover, startDate, active, location }) => {
    if (!logo) {
      message.warning('Es necesario añadir el logotipo');
      return;
    }

    if (!cover) {
      message.warning('Es necesario añadir el cover');
      return;
    }

    if (!location?.formattedAddress) {
      message.warning('Es necesario seleccionar la ubicación del desarrollo');
      return;
    }

    setSaving(true);
    const { errors } = await updateDevelopment({
      variables: {
        id: development.id,
        development: {
          name,
          logo,
          cover,
          startDate,
          active,
          location,
        },
      },
    });

    if (errors) {
      message.error(errors[0].message);
    } else {
      message.success('El desarrollo se ha creado correctamente');
      await reloadDevelopment();
    }

    setSaving(false);
  };

  return (
    <Container>
      {loadingDevelopment ? (
        <Box display="flex" m={40} justifyContent="center" width="100%">
          <Loading />
        </Box>
      ) : (
        <DevelopmentForm
          initialValues={development}
          form={form}
          loading={saving}
          onFinish={onFinish}
        />
      )}
    </Container>
  );
};

export default General;
