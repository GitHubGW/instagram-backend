import { gql } from "apollo-server-core";

export default gql`
  type UploadPhotoResult {
    ok: Boolean!
    message: String!
    photo: Photo
  }

  type Mutation {
    uploadPhoto(photo: String!, caption: String): UploadPhotoResult!
  }
`;
