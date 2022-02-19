import { gql } from "apollo-server-core";

export default gql`
  type SeePhotoResult {
    ok: Boolean!
    message: String!
    photo: Photo
  }

  type Query {
    seePhoto(photoId: Int!): SeePhotoResult!
  }
`;
