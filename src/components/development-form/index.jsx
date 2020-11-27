import { useState } from 'react';
import PropTypes from 'prop-types';
import PlaceSearchInput from '@components/place-search-input';
import Map, { Marker } from '@components/map';
import Loading from '@components/loading';
import { validateImageTypes } from '@config/utils/files';
import useUpload from '@hooks/use-upload';
import moment from 'moment';
import { PlusOutlined, HomeOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import Box from '@components/box';
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
} from 'antd';
import { Image, CoverContainer, FormCol } from './elements';

const { Item } = Form;
const { TextArea } = Input;

const DevelopmentForm = ({ onFinish, loading, form, initialValues, ...props }) => {
  const [logo, setLogo] = useState(initialValues?.logo || '');
  const [cover, setCover] = useState(initialValues?.cover || '');
  const [place, setPlace] = useState(
    initialValues?.location
      ? {
          formattedAddress: initialValues?.location.formattedAddress,
          location: {
            lat: initialValues?.location.geolocation.coordinates[1],
            lng: initialValues?.location.geolocation.coordinates[0],
          },
        }
      : undefined
  );
  const [placeSearch, setPlaceSearch] = useState(initialValues?.location?.formattedAddress || '');
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  const { upload: uploadCover, uploading: uploadingCover, progress: progressCover } = useUpload();
  const { upload: uploadLogo, uploading: uploadingLogo } = useUpload();

  const handleUploadCover = async ({ file }) => {
    const url = await uploadCover(file, file.name);
    setCover(url);
  };

  const handleUploadLogo = async ({ file }) => {
    const url = await uploadLogo(file, file.name);
    setLogo(url);
  };

  const handleOnFinish = ({ name, startDate, extraInfo, active }) =>
    onFinish({
      name,
      logo,
      cover,
      startDate,
      active,
      location: {
        formattedAddress: place?.formattedAddress,
        geolocation: {
          type: 'Point',
          coordinates: [place?.location.lng, place?.location.lat],
        },
        extraInfo,
      },
    });

  return (
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
              {cover ? (
                <Image src={cover} alt="cover" />
              ) : (
                <Box width="100%">
                  {uploadingCover ? <Loading /> : <PlusOutlined />}
                  <Box mt="8px">{!uploadingCover ? 'Subir portada' : 'Subiendo...'}</Box>
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
      <Form
        layout="vertical"
        onFinish={handleOnFinish}
        form={form}
        initialValues={
          initialValues
            ? {
                ...initialValues,
                extraInfo: initialValues?.location.extraInfo,
                startDate: moment(initialValues?.startDate),
              }
            : undefined
        }
        {...props}
      >
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
                {!uploadingLogo && logo ? (
                  <Avatar size={100} shape="square" src={logo} alt="logo" />
                ) : (
                  <Box width="100%">
                    {uploadingLogo ? <Loading /> : <PlusOutlined />}
                    <Box mt="8px">{!uploadingLogo ? 'Subir logo' : 'Subiendo...'}</Box>
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
                loading={loading}
              >
                Guardar
              </Button>
            </Item>
          </FormCol>
        </Box>
      </Form>
    </Card>
  );
};

DevelopmentForm.defaultProps = {
  form: null,
  initialValues: null,
};

DevelopmentForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  form: PropTypes.object,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    logo: PropTypes.string,
    cover: PropTypes.string,
    startDate: PropTypes.any,
    active: PropTypes.bool,
    location: PropTypes.shape({
      formattedAddress: PropTypes.string.isRequired,
      geolocation: PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
      }).isRequired,
      extraInfo: PropTypes.string,
    }),
  }),
};

export default DevelopmentForm;
