import { gql } from "apollo-server-core";

export default gql`
  type CommonResult {
    ok: Boolean!
    message: String!
    id: Int
  }
`;
