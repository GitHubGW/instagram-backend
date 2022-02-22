import { gql } from "apollo-server-core";

export default gql`
  type Message {
    id: Int!
    text: String!
    read: Boolean!
    user: User!
    room: Room!
    createdAt: String!
    updatedAt: String!
  }
`;
