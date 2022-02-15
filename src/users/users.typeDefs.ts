import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: Int!
    name: String
    username: String!
    email: String!
    bio: String
    avatarUrl: String
    following: [User]
    followers: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    isFollowing: Boolean!
    isMe: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
