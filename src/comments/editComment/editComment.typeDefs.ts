import { gql } from "apollo-server-core";

export default gql`
  type EditCommentResult {
    ok: Boolean!
    message: String!
  }

  type Mutation {
    editComment(commentId: Int!, text: String!): EditCommentResult!
  }
`;
