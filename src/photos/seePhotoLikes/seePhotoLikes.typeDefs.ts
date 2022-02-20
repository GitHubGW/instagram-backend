import { gql } from "apollo-server-core";

export default gql`
  type SeePhotoLikesResult {
    ok: Boolean!
    message: String!
    users: [User]
  }

  type Query {
    seePhotoLikes(photoId: Int!, cursor: String): SeePhotoLikesResult!
  }
`;
