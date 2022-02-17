import { gql } from "apollo-server-core";

export default gql`
  type SeeHashtagResult {
    ok: Boolean!
    message: String!
    hashtag: Hashtag
  }

  type Query {
    seeHashtag(name: String!): SeeHashtagResult!
  }
`;
