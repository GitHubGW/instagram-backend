import { gql } from "apollo-server-core";

export default gql`
  type SeeRecommendPhotosResult {
    ok: Boolean!
    message: String!
    photos: [Photo]
  }

  type Query {
    seeRecommendPhotos: SeeRecommendPhotosResult!
  }
`;
