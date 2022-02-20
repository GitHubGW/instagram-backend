import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    editComment(commentId: Int!, text: String!): CommonResult!
  }
`;
