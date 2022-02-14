import { gql } from "apollo-server-core";

export default gql`
  type SeeFollowingResult {
    ok: Boolean!
    message: String!
    following: [User]
  }

  type Query {
    seeFollowing(username: String!, cursor: String): SeeFollowingResult!
  }
`;
