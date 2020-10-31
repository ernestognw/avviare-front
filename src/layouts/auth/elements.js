import styled from 'styled-components';

const AuthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.geekblue[9]};
  min-height: 100vh;
`;

export { AuthWrapper };
