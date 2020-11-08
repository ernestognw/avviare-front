import styled from 'styled-components';

const Image = styled.div`
  background: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 200px;
`;

const Container = styled.div`
  padding: 20px;
`;

const CoverContainer = styled.div`
  .ant-upload {
    width: 100%;
    height: 200px;
  }
`;

const FormCol = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export { Container, Image, CoverContainer, FormCol };
