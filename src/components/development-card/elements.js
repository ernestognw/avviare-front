import styled from 'styled-components';
import { Card as DefaultCard, Avatar as DefaultAvatar } from 'antd';

const Card = styled(DefaultCard)`
  .ant-card-meta-avatar {
    margin-top: -65px;
  }
  .ant-card-meta-title {
    margin-bottom: -2px !important;
  }
`;

const Avatar = styled(DefaultAvatar)`
  border: 3px solid ${(props) => props.theme.colors.primary};
`;

export { Card, Avatar };
