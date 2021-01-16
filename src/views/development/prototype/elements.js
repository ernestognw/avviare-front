import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const ConceptsContainer = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 20px;
`;

const EmptyContainer = styled.div`
  display: flex;
  margin: 40px;
  padding: 50px 0;
  justify-content: center;
  align-items: center;
`;

export { Container, ConceptsContainer, EmptyContainer };
