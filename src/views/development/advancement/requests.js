import { gql } from '@apollo/client';

const GET_ADVANCEMENT = gql`
  query advancement($id: ID!, $development: QueryOperators) {
    advancement(id: $id) {
      id
      photos {
        fileSource
      }
      createdBy {
        id
        profileImg
        firstName
        lastName
        username
        worksAt(development: $development) {
          developmentRole
        }
      }
      subconceptInstance {
        id
        subconcept {
          id
          code
          name
        }
        allotment {
          id
          number
          block {
            id
            number
          }
        }
      }
      development {
        id
        name
        active
        cover
        logo
        startDate
        workers {
          results {
            id
            firstName
            lastName
            profileImg
          }
        }
      }
      provider {
        id
        businessName
        RFC
      }
      percentageAdvanced
      createdAt
      updatedAt
      notes
    }
  }
`;

export { GET_ADVANCEMENT };
