import styled from 'styled-components';
import { Skeleton, Avatar as DefaultAvatar } from 'antd';

const imageHeight = '100px';

const Cover = styled.div`
  background: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: ${imageHeight};
`;

const SkeletonImage = styled(Skeleton.Image)`
  width: 100%;
  height: ${imageHeight};

  .ant-skeleton-image {
    height: ${imageHeight};
    width: 100%;
  }
`;

const Avatar = styled(DefaultAvatar)`
  margin-top: -40px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  margin-bottom: 15px;
  border: 2px solid ${(props) => props.theme.colors.primary};
`;

export { Cover, SkeletonImage, Avatar };
