import { gql } from "apollo-server-core";

export default gql`
  type SeeCommentsResult {
    ok: Boolean!
    message: String!
    comments: [Comment]
  }

  type Query {
    seeComments(photoId: Int!, cursor: Int): SeeCommentsResult!
  }
`;
