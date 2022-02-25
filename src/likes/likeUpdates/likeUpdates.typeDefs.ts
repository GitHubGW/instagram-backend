import { gql } from "apollo-server-core";

export default gql`
  type Subscription {
    likeUpdates(photoId: Int!): Like
  }
`;
