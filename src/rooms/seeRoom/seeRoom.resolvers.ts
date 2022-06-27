import { Room } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeRoomArgs {
  roomId: number;
}

interface SeeRoomResult extends CommonResult {
  room?: Room;
}

const resolvers: Resolvers = {
  Query: {
    seeRoom: async (_, { roomId }: SeeRoomArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<SeeRoomResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundRoom: Room | null = await prisma.room.findFirst({
          where: { id: roomId, users: { some: { id: loggedInUser?.id } } },
          include: { users: true, messages: { include: { user: true } } },
        });

        if (foundRoom === null) {
          return { ok: false, message: "존재하지 않는 채팅방입니다." };
        }

        return { ok: true, message: "채팅방 보기에 성공하였습니다.", room: foundRoom };
      } catch (error) {
        console.log("seeRoom error");
        return { ok: false, message: "채팅방 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
