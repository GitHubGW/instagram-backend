import { gql } from "apollo-server-core";

export default gql`
  type SearchHashtagsResult {
    ok: Boolean!
    message: String!
    hashtags: [Hashtag]
  }

  type Query {
    searchHashtags(name: String!): SearchHashtagsResult!
  }
`;
