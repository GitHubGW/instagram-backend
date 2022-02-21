import { gql } from "apollo-server-core";

export default gql`
  type Room {
    id: Int!
    users: [User]!
    messages: [Message]!
    createdAt: String!
    updatedAt: String!
  }
`;
