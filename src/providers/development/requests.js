import { gql } from '@apollo/client';

const GET_DEVELOPMENT = gql`
  query development($id: ID!) {
    development(id: $id) {
      id
      name
      logo
      cover
      startDate
      active
      location {
        formattedAddress
        geolocation {
          type
          coordinates
        }
        extraInfo
      }
    }
    userDevelopmentRoleByToken(developmentId: $id)
  }
`;

export { GET_DEVELOPMENT };
