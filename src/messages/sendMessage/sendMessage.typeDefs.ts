import { gql } from "apollo-server-core";

export default gql`
  type SendMessageResult {
    ok: Boolean!
    message: String!
    room: Room
  }

  type Mutation {
    sendMessage(text: String, roomId: Int, userId: Int): SendMessageResult!
  }
`;
