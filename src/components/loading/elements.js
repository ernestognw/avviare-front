import styled from 'styled-components';
import { Spin } from 'antd';
import { compose, space, layout, color, typography, flexbox } from 'styled-system';

const SystemSpin = styled(Spin)`
  ${compose(space, layout, color, typography, flexbox)}
`;

export { SystemSpin };
