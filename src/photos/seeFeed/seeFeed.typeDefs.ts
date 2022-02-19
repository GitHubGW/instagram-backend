import { gql } from "apollo-server-core";

export default gql`
  type SeeFeedResult {
    ok: Boolean!
    message: String!
    photos: [Photo]
  }

  type Query {
    seeFeed(cursor: Int): SeeFeedResult!
  }
`;
