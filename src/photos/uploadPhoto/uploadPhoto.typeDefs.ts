import { gql } from "apollo-server-core";

export default gql`
  scalar Upload

  type UploadPhotoResult {
    ok: Boolean!
    message: String!
    photo: Photo
  }

  type Mutation {
    uploadPhoto(photo: Upload!, caption: String): UploadPhotoResult!
  }
`;
