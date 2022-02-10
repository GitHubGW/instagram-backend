import { gql } from "apollo-server-core";

export default gql`
  type EditProfileResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    editProfile(name: String, username: String, email: String, password: String, token: String): EditProfileResult!
  }
`;
