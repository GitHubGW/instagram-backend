import { gql } from "apollo-server-core";

export default gql`
  type Room {
    id: Int!
    users: [User]
    messages: [Message]
    totalUnreadMessages: Int!
    createdAt: String!
    updatedAt: String!
  }
`;
