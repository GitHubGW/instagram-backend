import { Message } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface ReadMessageArgs {
  messageId: number;
}

const resolvers: Resolvers = {
  Mutation: {
    readMessage: async (_, { messageId }: ReadMessageArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CommonResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundMessage: Message | null = await prisma.message.findFirst({
          where: {
            id: messageId,
            read: false,
            userId: { not: loggedInUser?.id },
            room: { users: { some: { id: loggedInUser?.id } } },
          },
        });

        if (foundMessage === null) {
          return { ok: false, message: "읽지 않은 메세지가 존재하지 않습니다." };
        }

        await prisma.message.update({ where: { id: messageId }, data: { read: true } });
        return { ok: true, message: "메시지 읽기에 성공하였습니다." };
      } catch (error) {
        console.log("readMessage error");
        return { ok: false, message: "메시지 읽기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
