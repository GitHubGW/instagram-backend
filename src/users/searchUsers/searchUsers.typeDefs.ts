import { gql } from "apollo-server-core";

export default gql`
  type SearchUsersResult {
    ok: Boolean!
    message: String!
    users: [User]
  }

  type Query {
    searchUsers(username: String!, cursor: String): SearchUsersResult!
  }
`;
