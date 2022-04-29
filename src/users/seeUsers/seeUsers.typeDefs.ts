import { gql } from "apollo-server-core";

export default gql`
  type SeeUsersResult {
    ok: Boolean!
    message: String!
    users: [User]
  }

  type Query {
    seeUsers: SeeUsersResult!
  }
`;
