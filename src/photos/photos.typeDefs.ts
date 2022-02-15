import { gql } from "apollo-server-core";

export default gql`
  type Photo {
    id: Int!
    user: User!
    photoUrl: String!
    caption: String
    hashtags: [Hashtag]
    createdAt: String!
    updatedAt: String!
  }
`;
