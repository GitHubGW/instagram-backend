import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    createAccount(name: String, username: String!, email: String!, password: String!): CommonResult!
  }
`;
