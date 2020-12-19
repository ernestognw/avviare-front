import styled from 'styled-components';

const DocumentsContainer = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 20px;

  .ant-card {
    display: flex;
    flex-direction: column;
  }
  .ant-card-body {
    flex-grow: 1;
    padding: 24px;
  }
`;

export { DocumentsContainer };
