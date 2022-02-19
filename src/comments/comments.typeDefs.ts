import { gql } from "apollo-server-core";

export default gql`
  type Comment {
    id: Int!
    text: String!
    user: User!
    photo: Photo!
    isMe: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
