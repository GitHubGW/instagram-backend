import { gql } from "apollo-server-core";

export default gql`
  type Room {
    id: Int!
    users: [User]
    messages: [Message]
    totalUnreadMessages: Int!
    latestMessage: Message
    createdAt: String!
    updatedAt: String!
  }
`;
