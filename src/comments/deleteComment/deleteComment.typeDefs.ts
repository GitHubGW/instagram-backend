import { gql } from "apollo-server-core";

export default gql`
  type DeleteCommentResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    deleteComment(commentId: Int!): DeleteCommentResult!
  }
`;
