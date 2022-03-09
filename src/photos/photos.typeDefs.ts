import { gql } from "apollo-server-core";

export default gql`
  type Photo {
    id: Int!
    user: User!
    photoUrl: String!
    caption: String
    hashtags: [Hashtag]
    comments: [Comment]
    totalLikes: Int!
    totalComments: Int!
    isMe: Boolean!
    isLiked: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
