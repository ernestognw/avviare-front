import styled from 'styled-components';
import { green } from '@ant-design/colors';

const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${green[9]};
  min-height: 100vh;
`;

export { AuthWrapper };
