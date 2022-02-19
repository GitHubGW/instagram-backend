import { gql } from "apollo-server-core";

export default gql`
  type DeleteAccountResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    deleteAccount(userId: Int!): DeleteAccountResult!
  }
`;
