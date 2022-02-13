import { gql } from "apollo-server-core";

export default gql`
  type FollowUserResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    followUser(username: String!): FollowUserResult!
  }
`;
