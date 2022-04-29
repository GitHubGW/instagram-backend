import { gql } from "apollo-server-core";

export default gql`
  type SeeFeedResult {
    ok: Boolean!
    message: String!
    photos: [Photo]
    lastPhotoId: Int
  }

  type Query {
    seeFeed(cursor: Int): SeeFeedResult!
  }
`;
