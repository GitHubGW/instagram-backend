import { gql } from "apollo-server-core";

export default gql`
  type Hashtag {
    id: Int!
    name: String!
    photos(cursor: Int): [Photo]
    totalPhotos: Int
    createdAt: String!
    updatedAt: String!
  }
`;
