import styled from 'styled-components';
import { Card as DefaultCard } from 'antd';

const Card = styled(DefaultCard)`
  width: 100%;

  .ant-card-body {
    padding-left: 0;
    display: flex;
    width: 100%;
  }
`;

export { Card };
