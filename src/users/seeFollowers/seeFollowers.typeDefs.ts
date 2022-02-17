import { gql } from "apollo-server-core";

export default gql`
  type SeeFollowersResult {
    ok: Boolean!
    message: String!
    followers: [User]
  }

  type Query {
    seeFollowers(username: String!, cursor: String): SeeFollowersResult!
  }
`;
