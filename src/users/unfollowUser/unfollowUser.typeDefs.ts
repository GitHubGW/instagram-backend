import { gql } from "apollo-server-core";

export default gql`
  type UnfollowUserResult {
    ok: Boolean!
    message: String!
    user: User
  }

  type Mutation {
    unfollowUser(username: String!): UnfollowUserResult!
  }
`;
