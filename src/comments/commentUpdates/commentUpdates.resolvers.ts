import prisma from "../../prisma";
import pubsub from "../../pubsub";
import { Comment, Photo, User } from ".prisma/client";
import { withFilter } from "graphql-subscriptions";

interface CommentUpdatesPayload {
  commentUpdates: Comment;
}

interface CommentUpdatesArgs {
  photoId: number;
}

interface CommentUpdatesContext {
  loggedInUser?: User;
}

const resolvers = {
  Subscription: {
    commentUpdates: {
      subscribe: async (parent: any, args: CommentUpdatesArgs, context: CommentUpdatesContext, info: any) => {
        const foundPhoto: Photo | null = await prisma.photo.findFirst({
          where: { id: args.photoId, userId: context.loggedInUser?.id },
        });

        if (foundPhoto === null) {
          throw new Error("존재하지 않거나 구독할 수 없는 사진입니다.");
        }

        return withFilter(
          () => pubsub.asyncIterator(["COMMENT_UPDATES"]),
          (payload: CommentUpdatesPayload, args: CommentUpdatesArgs, context: CommentUpdatesContext): boolean => {
            if (payload.commentUpdates.photoId !== args.photoId) {
              return false;
            }
            return true;
          }
        )(parent, args, context, info);
      },
    },
  },
};

export default resolvers;
