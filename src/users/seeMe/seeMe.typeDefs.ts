import { gql } from "apollo-server-core";

export default gql`
  type seeMeResult {
    ok: Boolean!
    message: String!
    user: User
  }

  type Query {
    seeMe: seeMeResult!
  }
`;
