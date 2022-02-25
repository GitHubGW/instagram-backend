import { gql } from "apollo-server-core";

export default gql`
  type Subscription {
    followUpdates(userId: Int!): User
  }
`;
