import styled from 'styled-components';
import { green, grey } from '@ant-design/colors';

const MarkerContainer = styled.div`
  position: relative;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background: ${green[9]};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5.5px;
  color: ${grey[0]};
  bottom: 30px;
  z-index: 1;

  &::after {
    position: absolute;
    content: '';
    width: 0px;
    height: 0px;
    bottom: -18px;
    border: 7.9px solid transparent;
    border-top: 14px solid ${green[9]};
    left: 2.1px;
    z-index: -1;
  }
`;

export { MarkerContainer };
