import { Room } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SendMessageArgs {
  text: string;
  roomId?: number;
  userId?: number;
}

interface SendMessageResult extends CommonResult {
  room?: Room;
}

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: async (_: any, { text, roomId, userId }: SendMessageArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<SendMessageResult> => {
      try {
        handleCheckLogin(loggedInUser);

        if (roomId === undefined && userId === undefined) {
          return { ok: false, message: "채팅방 아이디 또는 유저 아이디가 존재하지 않습니다." };
        }
        if (roomId && userId) {
          return { ok: false, message: "채팅방 아이디와 유저 아이디 중 하나만 존재해야 합니다." };
        }

        if (userId) {
          const countedUser: number = await prisma.user.count({ where: { id: userId } });

          if (countedUser === 0) {
            return { ok: false, message: "존재하지 않는 유저입니다." };
          }

          const createdRoom: Room = await prisma.room.create({
            data: { users: { connect: [{ id: loggedInUser?.id }, { id: userId }] } },
          });
          await prisma.message.create({
            data: {
              text,
              user: { connect: { id: loggedInUser?.id } },
              room: { connect: { id: createdRoom.id } },
            },
          });
        } else if (roomId) {
          const countedRoom: number = await prisma.room.count({ where: { id: roomId } });

          if (countedRoom === 0) {
            return { ok: false, message: "존재하지 않는 채팅방입니다." };
          }

          await prisma.message.create({
            data: {
              text,
              user: { connect: { id: loggedInUser?.id } },
              room: { connect: { id: roomId } },
            },
          });
        }

        return { ok: true, message: "메시지 전송에 성공하였습니다." };
      } catch (error) {
        console.log("sendMessage error");
        return { ok: false, message: "메시지 전송에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
