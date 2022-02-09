import { gql } from "apollo-server-core";

export default gql`
  type CreateAccountResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    createAccount(name: String, username: String!, email: String!, password: String!): CreateAccountResult!
  }
`;
