import React, { useState } from 'react';
import { useTitle } from '@providers/layout';
import useUpload from '@hooks/use-upload';
import { validateImageTypes } from '@config/utils/files';
import { PlusOutlined, HomeOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import Box from '@components/box';
import { useHistory } from 'react-router-dom';
import PlaceSearchInput from '@components/place-search-input';
import Map, { Marker } from '@components/map';
import Loading from '@components/loading';
import { useMutation } from '@apollo/client';
import {
  Card,
  Form,
  Upload,
  Progress,
  Input,
  DatePicker,
  Row,
  Col,
  Avatar,
  Button,
  Switch,
  message,
} from 'antd';
import { Container, Image, CoverContainer, FormCol } from './elements';
import { CREATE_DEVELOPMENT } from './requests';

const { Item } = Form;
const { TextArea } = Input;

const New = () => {
  useTitle('Crear un desarrollo');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [place, setPlace] = useState();
  const [placeSearch, setPlaceSearch] = useState('');
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const { upload: uploadCover, uploading: uploadingCover, progress: progressCover } = useUpload();
  const { upload: uploadLogo, uploading: uploadingLogo } = useUpload();

  const [createDevelopment] = useMutation(CREATE_DEVELOPMENT);

  const { push } = useHistory();

  const handleUploadCover = async ({ file }) => {
    const url = await uploadCover(file, file.name);
    setCoverUrl(url);
  };

  const handleUploadLogo = async ({ file }) => {
    const url = await uploadLogo(file, file.name);
    setLogoUrl(url);
  };

  const onFinish = async ({ name, startDate, extraInfo, active }) => {
    if (!logoUrl) {
      message.warning('Es necesario añadir el logotipo');
      return;
    }

    if (!coverUrl) {
      message.warning('Es necesario añadir el cover');
      return;
    }

    if (!place?.formattedAddress) {
      message.warning('Es necesario seleccionar la ubicación del desarrollo');
      return;
    }

    setSaving(true);
    const { data, errors } = await createDevelopment({
      variables: {
        development: {
          name,
          logo: logoUrl,
          cover: coverUrl,
          startDate,
          active,
          location: {
            formattedAddress: place.formattedAddress,
            geolocation: {
              type: 'Point',
              coordinates: [place.location.lng, place.location.lat],
            },
            extraInfo,
          },
        },
      },
    });

    if (errors) {
      message.error(errors[0].message);
      setSaving(false);
    } else {
      message.success('El desarrollo se ha creado correctamente');
      push(`/development/${data.createDevelopment.id}`);
    }
  };

  return (
    <Container>
      <Card
        cover={
          <CoverContainer>
            <ImgCrop aspect={16 / 9}>
              <Upload
                listType="picture-card"
                className="cover"
                style={{ height: 200, width: '100%' }}
                showUploadList={false}
                customRequest={handleUploadCover}
                beforeUpload={(file) => validateImageTypes(file)}
                accept=".png,.jpg,.jpeg"
              >
                {coverUrl ? (
                  <Image src={coverUrl} alt="cover" />
                ) : (
                  <Box width="100%">
                    {uploadingCover ? <Loading /> : <PlusOutlined />}
                    <Box mt="8px">Subir portada</Box>
                    {uploadingCover && (
                      <Box
                        as={Progress}
                        position="absolute"
                        bottom={0}
                        left={0}
                        size="small"
                        percent={progressCover}
                        showInfo={false}
                      />
                    )}
                  </Box>
                )}
              </Upload>
            </ImgCrop>
          </CoverContainer>
        }
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Box display="flex">
            <Box mr={30}>
              <ImgCrop>
                <Upload
                  listType="picture-card"
                  className="logo"
                  style={{ height: 200, width: '100%' }}
                  showUploadList={false}
                  customRequest={handleUploadLogo}
                  beforeUpload={(file) => validateImageTypes(file)}
                  accept=".png,.jpg,.jpeg"
                >
                  {logoUrl ? (
                    <Avatar size={100} shape="square" src={logoUrl} alt="logoUrl" />
                  ) : (
                    <Box width="100%">
                      {uploadingLogo ? <Loading /> : <PlusOutlined />}
                      <Box mt="8px">Subir logo</Box>
                      {uploadingLogo && (
                        <Box
                          as={Progress}
                          position="absolute"
                          bottom={0}
                          left={0}
                          size="small"
                          percent={progressCover}
                          showInfo={false}
                        />
                      )}
                    </Box>
                  )}
                </Upload>
              </ImgCrop>
            </Box>
            <FormCol>
              <Row gutter={16}>
                <Col span={10}>
                  <Item
                    label="Nombre"
                    name="name"
                    rules={[{ required: true, message: 'Ingresa el nombre del desarrollo' }]}
                  >
                    <Input size="large" prefix={<HomeOutlined />} placeholder="Nombre (s)" />
                  </Item>
                </Col>
                <Col span={10}>
                  <Item
                    label="Fecha de inicio"
                    name="startDate"
                    rules={[
                      { required: true, message: 'La fecha programada de inicio es necesaria' },
                    ]}
                  >
                    <DatePicker style={{ width: '100%' }} size="large" />
                  </Item>
                </Col>
                <Col style={{ display: 'flex', justifyContent: 'center' }} span={4}>
                  <Item
                    name="active"
                    label="Activo"
                    valuePropName="checked"
                    tooltip="Esto hará que a los trabajadores les aparezca este desarrollo en la sección de 'Activos' de la barra lateral"
                  >
                    <Switch />
                  </Item>
                </Col>
              </Row>
              <Item label="Ubicación">
                {googleApiLoaded && (
                  <PlaceSearchInput
                    placeholder="Direccion del desarrollo"
                    value={placeSearch}
                    size="large"
                    onChange={(value) => setPlaceSearch(value)}
                    onSelect={({ result, lat, lng }) => {
                      setPlaceSearch(result);
                      setPlace({
                        formattedAddress: result,
                        location: {
                          lat,
                          lng,
                        },
                      });
                    }}
                  />
                )}
              </Item>
              <Item>
                <Map
                  onGoogleApiLoaded={() => setGoogleApiLoaded(true)}
                  style={{ height: 500 }}
                  center={place?.location}
                >
                  {place && <Marker lat={place.location.lat} lng={place.location.lng} />}
                </Map>
              </Item>
              <Item label="Información extra" name="extraInfo">
                <TextArea placeholder="Añade información extra sobre la ubicación" rows={4} />
              </Item>
              <Item>
                <Button
                  style={{ marginTop: 20, marginLeft: 'auto', display: 'block' }}
                  size="large"
                  type="primary"
                  htmlType="submit"
                  loading={saving}
                >
                  Crear
                </Button>
              </Item>
            </FormCol>
          </Box>
        </Form>
      </Card>
    </Container>
  );
};

export default New;
