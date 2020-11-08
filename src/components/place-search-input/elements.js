import styled from 'styled-components';
import { Card } from 'antd';

const DropDownContainer = styled(Card)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin-top: 2.3rem;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: hidden;
  z-index: 5;

  .ant-card-body {
    padding: 0;
  }
`;

const ResultItem = styled.div`
  cursor: pointer;
  padding: 10px 0.7rem;
  ${(props) =>
    props.active &&
    `
    background: ${props.theme.colors.primaryPalette[1]};
    .title {
		  color: ${props.theme.colors.primary} !important;
      font-weight: 700;
    }
	`};
`;

const Container = styled.div`
  position: relative;
`;

export { DropDownContainer, ResultItem, Container };
