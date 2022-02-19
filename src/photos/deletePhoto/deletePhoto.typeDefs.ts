import { gql } from "apollo-server-core";

export default gql`
  type DeletePhotoResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    deletePhoto(photoId: Int!): DeletePhotoResult!
  }
`;
