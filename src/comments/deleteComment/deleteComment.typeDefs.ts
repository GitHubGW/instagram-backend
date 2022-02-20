import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    deleteComment(commentId: Int!): CommonResult!
  }
`;
