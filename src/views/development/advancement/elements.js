import styled from 'styled-components';
import Box from '@components/box';

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 30px;
`;

const Col = styled(Box)`
  flex-basis: ${(props) => props.basis}%;
  margin-left: 20px;

  &:first-child {
    margin-left: 0;
  }
`;

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 12px;
  margin-bottom: 20px;
`;

const GalleryItem = styled.div`
  background-image: url(${(props) => props.src});
  height: 200px;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
  cursor: pointer;
`;

export { Container, Col, GalleryContainer, GalleryItem };
