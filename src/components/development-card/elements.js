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

const Image = styled.div`
  background: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 200px;
`;

export { Card, Avatar, Image };
