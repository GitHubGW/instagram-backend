import { gql } from "apollo-server-core";

export default gql`
  type SeeMeResult {
    ok: Boolean!
    message: String!
    user: User
  }

  type Query {
    seeMe: SeeMeResult!
  }
`;
