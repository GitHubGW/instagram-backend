import { gql } from "apollo-server-core";

export default gql`
  type SearchPhotosResult {
    ok: Boolean!
    message: String!
    photos: [Photo]
  }

  type Query {
    searchPhotos(keyword: String!, cursor: Int): SearchPhotosResult!
  }
`;
