import pubsub from "../../pubsub";
import { User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface FollowUserArgs {
  username: string;
}

interface FollowUserResult extends CommonResult {
  user?: User;
}

const resolvers: Resolvers = {
  Mutation: {
    followUser: async (_, { username }: FollowUserArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<FollowUserResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundUser: User | null = await prisma.user.findUnique({ where: { username } });

        if (foundUser === null) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }

        await prisma.user.update({ where: { id: loggedInUser?.id }, data: { following: { connect: { username } } } });
        pubsub.publish("FOLLOW_UPDATES", { followUpdates: loggedInUser });
        return { ok: true, message: "팔로우에 성공하였습니다.", user: foundUser };
      } catch (error) {
        console.log("followUser error");
        return { ok: false, message: "팔로우에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
