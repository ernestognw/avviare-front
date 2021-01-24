import { Typography, Progress, Card, Tag, Skeleton, Statistic } from 'antd';
import { useUser } from '@providers/user';
import { useDevelopment } from '@providers/development';
import { useQuery } from '@apollo/client';
import Box from '@components/box';
import { developmentRoles } from '@config/constants/user';
import { FolderOpenOutlined, BuildOutlined, LayoutOutlined } from '@ant-design/icons';
import { Container, MetricsContainer, HeaderContainer } from './elements';
import { DASHBOARD_METRICS } from './requests';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const { user } = useUser();
  const { development, rawDevelopmentRole } = useDevelopment();

  const { data, loading } = useQuery(DASHBOARD_METRICS, {
    variables: {
      developmentId: development.id,
      development: {
        eq: development.id,
      },
    },
  });

  return (
    <Container>
      <Card>
        <HeaderContainer>
          <Box flexGrow={1}>
            <Title style={{ marginBottom: 0 }} level={2}>
              Bienvenido {user.firstName}
            </Title>
            <Paragraph type="secondary">
              Tu rol en este desarrollo es: <Tag>{developmentRoles[rawDevelopmentRole]}</Tag>
            </Paragraph>
          </Box>
          <Box textAlign="center">
            {loading ? (
              <Skeleton.Avatar size={120} active />
            ) : (
              <Progress
                type="circle"
                percent={data?.development.progress?.toFixed(2)}
                width={120}
              />
            )}
            <Paragraph style={{ marginBottom: 0, marginTop: 10 }} type="secondary">
              Avance del desarrollo
            </Paragraph>
          </Box>
        </HeaderContainer>
      </Card>

      <Title style={{ marginTop: 20 }} level={3}>
        Métricas del desarrollo
      </Title>
      <MetricsContainer>
        <Card>
          {loading ? (
            <Skeleton paragraph={{ rows: 1 }} active />
          ) : (
            <Statistic
              title="Documentos"
              value={data?.documents.info.count}
              prefix={<FolderOpenOutlined />}
            />
          )}
        </Card>
        <Card>
          {loading ? (
            <Skeleton paragraph={{ rows: 1 }} active />
          ) : (
            <Statistic
              title="Prototipos"
              value={data?.allotmentPrototypes.info.count}
              prefix={<BuildOutlined />}
            />
          )}
        </Card>
        <Card>
          {loading ? (
            <Skeleton paragraph={{ rows: 1 }} active />
          ) : (
            <Statistic
              title="Lotes"
              value={data?.allotments.info.count}
              prefix={<LayoutOutlined />}
            />
          )}
        </Card>
      </MetricsContainer>
    </Container>
  );
};

export default Dashboard;
