import styled from 'styled-components';
import { Upload as DefaultUpload } from 'antd';

const Upload = styled(DefaultUpload)`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export { Upload };
