import { gql } from "apollo-server-core";

export default gql`
  type Subscription {
    messageUpdates(roomId: Int!): Message
  }
`;
