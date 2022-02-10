import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: Int!
    name: String
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }
`;
