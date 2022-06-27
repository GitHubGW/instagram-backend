import { Comment } from ".prisma/client";
import { Context, Resolvers } from "../types";

const resolvers: Resolvers = {
  Comment: {
    isMe: (parent: Comment, __, { loggedInUser }: Context): boolean => {
      const isMe: boolean = parent.userId === loggedInUser?.id;

      if (isMe === false) {
        return false;
      }

      return true;
    },
  },
};

export default resolvers;
