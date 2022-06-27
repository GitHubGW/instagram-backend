import { Message } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface DeleteMessageArgs {
  messageId: number;
}

const resolvers: Resolvers = {
  Mutation: {
    deleteMessage: async (_, { messageId }: DeleteMessageArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CommonResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundMessage: Message | null = await prisma.message.findFirst({
          where: { id: messageId, read: false, userId: loggedInUser?.id, room: { users: { some: { id: loggedInUser?.id } } } },
        });

        if (foundMessage === null) {
          return { ok: false, message: "삭제할 수 있는 메세지가 존재하지 않습니다." };
        }

        await prisma.message.delete({ where: { id: messageId } });
        return { ok: true, message: "메시지 삭제에 성공하였습니다." };
      } catch (error) {
        console.log("deleteMessage error");
        return { ok: false, message: "메시지 삭제에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
