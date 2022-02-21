import { gql } from "apollo-server-core";

export default gql`
  type Message {
    id: Int!
    text: String!
    user: User!
    room: Room!
    createdAt: String!
    updatedAt: String!
  }
`;
