import { gql } from "apollo-server-core";

export default gql`
  type Like {
    id: Int!
    photo: Photo!
    user: User!
    createdAt: String!
    updatedAt: String!
  }
`;
