import { gql } from '@apollo/client';
import { blockInfo } from '../requests';

const GET_BLOCK = gql`
  query block($id: ID!) {
    block(id: $id) {
      id
      number
    }
  }
`;

const UPDATE_BLOCK = gql`
  mutation updateBlock($id: ID!, $block: BlockUpdateInput!) {
    updateBlock(id: $id, block: $block){
      ${blockInfo}
    }
  }
`;

export { GET_BLOCK, UPDATE_BLOCK };
