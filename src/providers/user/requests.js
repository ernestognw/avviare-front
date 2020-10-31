import { gql } from '@apollo/client';

const GET_USER = gql`
  query userByToken {
    userByToken {
      id
      firstName
      lastName
      email
      dateOfBirth
      overallRole
      worksAt {
        development {
          id
          name
          cover
          logo
          startDate
          active
        }
      }
    }
  }
`;

export { GET_USER };
