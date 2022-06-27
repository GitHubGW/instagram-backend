import prisma from "../../prisma";
import pubsub from "../../pubsub";
import { Like, Photo, User } from ".prisma/client";
import { withFilter } from "graphql-subscriptions";

interface LikeUpdatesPayload {
  likeUpdates: Like;
}

interface LikeUpdatesArgs {
  photoId: number;
}

interface LikeUpdatesContext {
  loggedInUser?: User;
}

const resolvers = {
  Subscription: {
    likeUpdates: {
      subscribe: async (parent: any, args: LikeUpdatesArgs, context: LikeUpdatesContext, info: any) => {
        const foundPhoto: Photo | null = await prisma.photo.findFirst({
          where: { id: args.photoId, userId: context.loggedInUser?.id },
        });

        if (foundPhoto === null) {
          throw new Error("존재하지 않거나 구독할 수 없는 사진입니다.");
        }

        return withFilter(
          () => pubsub.asyncIterator(["LIKE_UPDATES"]),
          (payload: LikeUpdatesPayload, args: LikeUpdatesArgs): boolean => {
            if (payload.likeUpdates.photoId !== args.photoId) {
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
