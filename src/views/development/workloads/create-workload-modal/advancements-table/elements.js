import styled from 'styled-components';
import { Card } from 'antd';

const Container = styled(Card)`
  margin-top: 20px;

  .ant-card-body {
    padding: 0;
  }

  .ant-table-title {
    padding: 0;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export { Container, ActionsContainer };
