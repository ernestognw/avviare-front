import { gql } from '@apollo/client';

const CREATE_BLOCK = gql`
  mutation createBlock($block: BlockCreateInput!) {
    createBlock(block: $block) {
      id
    }
  }
`;

export { CREATE_BLOCK };
