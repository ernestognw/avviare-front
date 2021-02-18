import { useState, useMemo } from 'react';
import { Card, Typography, Breadcrumb, Tag, Avatar, Button } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { downloadFile } from '@utils/files';
import { useQuery } from '@apollo/client';
import { useDevelopment } from '@providers/development';
import { BlockOutlined } from '@ant-design/icons';
import Box from '@components/box';
import JSZip from 'jszip';
import axios from 'axios';
import Loading from '@components/loading';
import DevelopmentCard from '@components/development-card';
import ImageViewer from 'react-simple-image-viewer';
import { GET_ADVANCEMENT } from './requests';
import { Container, Col, GalleryContainer, GalleryItem } from './elements';

const { Title, Paragraph } = Typography;

const Advancement = () => {
  const [imageIndex, setImageindex] = useState(0);
  const [viewerOpen, toggleViewer] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { advancementId } = useParams();

  const { development } = useDevelopment();

  const { data, loading } = useQuery(GET_ADVANCEMENT, {
    variables: {
      id: advancementId,
      development: {
        eq: development.id,
      },
    },
  });

  const photos = useMemo(() => data?.advancement.photos.map(({ fileSource }) => fileSource) ?? [], [
    data,
  ]);

  const zipPhotos = async () => {
    const files = await Promise.all(
      photos.map((url) => axios.get(url, { responseType: 'arraybuffer' }))
    );

    const zip = new JSZip();

    files.forEach(({ data: res }, index) => {
      const pointIndex = photos[index].lastIndexOf('.');
      const extension = photos[index].slice(pointIndex);
      zip.file(`photo-${index}${extension}`, res);
    });

    return zip.generateAsync({ type: 'base64' });
  };

  const downloadPhotos = async () => {
    setDownloading(true);
    const name = `${data.advancement.subconceptInstance.subconcept.name}${
      data.advancement.subconceptInstance.allotment.number
    }${new Date().toISOString()}.zip`;
    const zipFileBase64 = await zipPhotos();
    downloadFile(`data:application/zip;base64,${zipFileBase64}`, name.replace(/ /g, ''));
    setDownloading(false);
  };

  if (loading)
    return (
      <Box display="flex" my={120} justifyContent="center" width="100%">
        <Loading />
      </Box>
    );

  const {
    advancement: {
      createdBy,
      subconceptInstance,
      development: advancementDevelopment,
      provider,
      percentageAdvanced,
      // updatedAt,
      // createdAt,
      notes,
    },
  } = data;

  return (
    <>
      <Box px={20} pt={20}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/development/${development.id}`}>
              <BlockOutlined style={{ marginRight: 5 }} />
              {development.name}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/development/${development.id}/advancements`}>Avances</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Detalle</Breadcrumb.Item>
        </Breadcrumb>
      </Box>
      <Box mt={20} as={Card}>
        <Box display="flex">
          <Box mr={10} textAlign="center">
            <Title style={{ margin: 0 }} level={1}>
              {percentageAdvanced}%
            </Title>
            <Paragraph style={{ margin: 0 }} type="secondary">
              Avance
            </Paragraph>
          </Box>
          <Box ml={20}>
            <Paragraph style={{ margin: 0, fontSize: 12 }} type="secondary">
              Hecho por:
            </Paragraph>
            <Title style={{ margin: 0 }} level={5}>
              {provider.businessName}
            </Title>
            <Tag>{provider.RFC}</Tag>
          </Box>
        </Box>
      </Box>
      <Container>
        <Col basis="80">
          {photos.length > 0 && (
            <>
              <Box display="flex">
                <Title level={3} style={{ marginRight: 'auto' }}>
                  Fotos
                </Title>
                <Button loading={downloading} onClick={downloadPhotos}>
                  Descargar
                </Button>
              </Box>
              <GalleryContainer>
                {photos.map((src, index) => (
                  <GalleryItem
                    onClick={() => {
                      toggleViewer(true);
                      setImageindex(index);
                    }}
                    key={src}
                    src={src}
                  />
                ))}
              </GalleryContainer>
            </>
          )}
          <Title level={3}>Notas</Title>
          <Paragraph>{notes ?? 'Sin notas'}</Paragraph>
        </Col>
        <Col basis="20" minWidth={250}>
          <Card>
            <Box display="flex" alignItems="center">
              <Avatar size={45} src={createdBy.profileImg} />
              <Box alignItems="center" ml={10}>
                <Paragraph style={{ margin: 0, fontSize: 12 }} type="secondary">
                  Registrado por:
                </Paragraph>
                <Title style={{ margin: 0 }} level={5}>
                  {createdBy.firstName} {createdBy.lastName}
                </Title>
                <Tag>{createdBy.worksAt?.[0]?.developmentRole ?? 'Sin rol'}</Tag>
                <Paragraph style={{ margin: 0 }} type="secondary">
                  @{createdBy.username}
                </Paragraph>
              </Box>
            </Box>
          </Card>
          <Card style={{ marginTop: 20 }}>
            <Box display="flex" alignItems="center">
              <Box alignItems="center" ml={10}>
                <Paragraph style={{ margin: 0, fontSize: 12 }} type="secondary">
                  Registrado en:
                </Paragraph>
                <Title style={{ margin: 0 }} level={5}>
                  Lote {subconceptInstance.allotment.number}
                </Title>
                <Paragraph style={{ margin: 0 }} type="secondary">
                  Manzana {subconceptInstance.allotment.block.number}
                </Paragraph>
              </Box>
            </Box>
          </Card>
          <Card style={{ marginTop: 20 }}>
            <Box display="flex" alignItems="center">
              <Box alignItems="center" ml={10}>
                <Paragraph style={{ margin: 0, fontSize: 12 }} type="secondary">
                  Subconcepto:
                </Paragraph>
                <Title style={{ margin: 0 }} level={5}>
                  {subconceptInstance.subconcept.name}
                </Title>
                <Tag>{subconceptInstance.subconcept.code}</Tag>
              </Box>
            </Box>
          </Card>
          <DevelopmentCard {...advancementDevelopment} mt={20} />
        </Col>
      </Container>
      {viewerOpen && (
        <ImageViewer
          src={photos}
          currentIndex={imageIndex}
          onClose={() => toggleViewer(false)}
          backgroundStyle={{
            backgroundColor: 'rgba(0,0,0,0.9)',
          }}
        />
      )}
    </>
  );
};

export default Advancement;
