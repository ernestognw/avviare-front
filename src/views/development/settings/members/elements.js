import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 30px;
  border: none;

  .ant-card-body {
    padding: 0;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export { Container, ActionsContainer };
