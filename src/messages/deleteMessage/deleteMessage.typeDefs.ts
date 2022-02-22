import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    deleteMessage(messageId: Int!): CommonResult!
  }
`;
