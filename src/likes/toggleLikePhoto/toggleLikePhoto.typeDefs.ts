import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    toggleLikePhoto(photoId: Int!): CommonResult!
  }
`;
