import styled from 'styled-components';
import { Layout, Avatar as DefaultAvatar } from 'antd';

const { Sider: DefaultSider } = Layout;

const Container = styled.div`
  display: flex;
  padding: 7px 15px;
  justify-content: center;
  align-items: center;

  &:before {
    ${(props) => (props.active ? "content: ''" : '')};
    position: absolute;
    left: 0;
    height: 30px;
    margin: auto 0;
    background-color: ${(props) => props.theme.colors.primary};
    width: 3px;
  }
`;

const SubtitleContainer = styled.div`
  display: flex;
  padding: 0 15px;
  justify-content: center;
  align-items: center;
`;

const Sider = styled(DefaultSider)`
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Avatar = styled(DefaultAvatar)`
  &:hover {
    box-shadow: 0px 0px 0px 3px ${(props) => props.theme.colors.primary};
  }
`;

export { Container, Sider, Avatar, SubtitleContainer };
