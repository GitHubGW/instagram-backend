import { gql } from "apollo-server-core";

export default gql`
  type FollowUserResult {
    ok: Boolean!
    message: String!
    user: User
  }

  type Mutation {
    followUser(username: String!): FollowUserResult!
  }
`;
