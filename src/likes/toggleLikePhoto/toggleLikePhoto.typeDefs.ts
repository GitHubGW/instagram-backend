import { gql } from "apollo-server-core";

export default gql`
  type ToggleLikePhotoResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    toggleLikePhoto(id: Int!): ToggleLikePhotoResult!
  }
`;
