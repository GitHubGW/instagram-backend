import { gql } from "apollo-server-core";

export default gql`
  type UnfollowUserResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    unfollowUser(username: String!): UnfollowUserResult!
  }
`;
