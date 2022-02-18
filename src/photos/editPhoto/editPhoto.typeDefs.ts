import { gql } from "apollo-server-core";

export default gql`
  type EditPhotoResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    editPhoto(id: Int!, caption: String!): EditPhotoResult!
  }
`;
