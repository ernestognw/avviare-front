import { useState } from 'react';
import { useTitle } from '@providers/layout';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { message } from 'antd';
import DevelopmentForm from '@components/development-form';
import { Container } from './elements';
import { CREATE_DEVELOPMENT } from './requests';

const New = () => {
  useTitle('Crear un desarrollo');

  const [saving, setSaving] = useState(false);
  const [createDevelopment] = useMutation(CREATE_DEVELOPMENT);
  const { push } = useHistory();

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
    const { data, errors } = await createDevelopment({
      variables: {
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
      push(`/development/${data.createDevelopment.id}`);
      return;
    }

    setSaving(false);
  };

  return (
    <Container>
      <DevelopmentForm loading={saving} onFinish={onFinish} />
    </Container>
  );
};

export default New;
