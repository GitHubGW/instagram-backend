import { gql } from "apollo-server-core";

export default gql`
  type SeeRoomResult {
    ok: Boolean!
    message: String!
    room: Room
  }

  type Query {
    seeRoom(roomId: Int!): SeeRoomResult!
  }
`;
