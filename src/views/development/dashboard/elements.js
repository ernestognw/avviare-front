import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const MetricsContainer = styled.div`
  display: grid;
  margin-top: 10px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;

  ${(props) => props.theme.media.lg`
    grid-template-columns: 1fr;
  `}
`;

const HeaderContainer = styled.div`
  display: flex;
  padding: 10px;
  height: 100%;
  align-items: center;

  ${(props) => props.theme.media.md`
    flex-direction: column;
  `}
`;

export { Container, MetricsContainer, HeaderContainer };
