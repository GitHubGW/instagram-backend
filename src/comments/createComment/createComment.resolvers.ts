import { Photo } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface CreateCommentArgs {
  photoId: number;
  text: string;
}

interface CreateCommentResult {
  ok: boolean;
  message: string;
}

const resolvers: Resolvers = {
  Mutation: {
    createComment: async (_: any, { photoId, text }: CreateCommentArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CreateCommentResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundPhoto: Photo | null = await prisma.photo.findUnique({ where: { id: photoId } });

        if (foundPhoto === null) {
          return { ok: false, message: "존재하지 않는 사진입니다." };
        }

        await prisma.comment.create({
          data: {
            text,
            photo: { connect: { id: photoId } },
            user: { connect: { id: loggedInUser?.id } },
          },
        });
        return { ok: true, message: "댓글 생성에 성공하였습니다." };
      } catch (error) {
        console.log("createComment error");
        return { ok: false, message: "댓글 생성에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
