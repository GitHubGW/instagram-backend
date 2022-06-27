import pubsub from "../../pubsub";
import { Message, Room, User } from ".prisma/client";
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
    sendMessage: async (_, { text, roomId, userId }: SendMessageArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<SendMessageResult> => {
      try {
        handleCheckLogin(loggedInUser);

        if (roomId === undefined && userId === undefined) {
          return { ok: false, message: "채팅방 아이디 또는 유저 아이디가 존재하지 않습니다." };
        }
        if (roomId && userId) {
          return { ok: false, message: "채팅방 아이디와 유저 아이디 중 하나만 존재해야 합니다." };
        }

        if (userId && roomId === undefined) {
          const countedUser: number = await prisma.user.count({ where: { id: userId } });

          if (countedUser === 0) {
            return { ok: false, message: "존재하지 않는 유저입니다." };
          }

          const createdRoom: Room = await prisma.room.create({
            data: { users: { connect: [{ id: loggedInUser?.id }, { id: userId }] } },
          });
          const createdMessage: Message & { user: User; room: Room } = await prisma.message.create({
            data: {
              text,
              user: { connect: { id: loggedInUser?.id } },
              room: { connect: { id: createdRoom.id } },
            },
            include: { user: true, room: true },
          });
          pubsub.publish("MESSAGE_UPDATES", { messageUpdates: createdMessage });
          return { ok: true, message: "메시지 전송에 성공하였습니다.", id: createdMessage.id };
        }

        if (roomId && userId === undefined) {
          const countedRoom: number = await prisma.room.count({ where: { id: roomId } });

          if (countedRoom === 0) {
            return { ok: false, message: "존재하지 않는 채팅방입니다." };
          }

          const createdMessage: Message & { user: User; room: Room } = await prisma.message.create({
            data: {
              text,
              user: { connect: { id: loggedInUser?.id } },
              room: { connect: { id: roomId } },
            },
            include: { user: true, room: true },
          });
          pubsub.publish("MESSAGE_UPDATES", { messageUpdates: createdMessage });
          return { ok: true, message: "메시지 전송에 성공하였습니다.", id: createdMessage.id };
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
