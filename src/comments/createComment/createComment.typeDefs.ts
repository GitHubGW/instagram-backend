import { gql } from "apollo-server-core";

export default gql`
  type CreateCommentResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    createComment(photoId: Int!, text: String!): CreateCommentResult!
  }
`;
