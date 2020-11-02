import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  padding: 30px;
`;

const TitleSection = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const DevelopmentsContainer = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 20px;
`;

const EmptyAndLoaderContainer = styled.div`
  display: flex;
  margin: 40px;
  padding: 50px 0;
  justify-content: center;
  align-items: center;
`;

export { Container, TitleSection, DevelopmentsContainer, EmptyAndLoaderContainer };
