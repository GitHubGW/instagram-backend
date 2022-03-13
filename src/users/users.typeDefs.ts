import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: Int!
    name: String
    username: String!
    email: String!
    bio: String
    avatarUrl: String
    photos(cursor: Int): [Photo]
    following: [User]
    followers: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    totalPhotos: Int!
    isFollowing: Boolean!
    isMe: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
