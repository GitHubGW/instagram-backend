import pubsub from "../../pubsub";
import { Comment, Photo } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface CreateCommentArgs {
  photoId: number;
  text: string;
}

const resolvers: Resolvers = {
  Mutation: {
    createComment: async (_, { photoId, text }: CreateCommentArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CommonResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundPhoto: Photo | null = await prisma.photo.findUnique({ where: { id: photoId } });

        if (foundPhoto === null) {
          return { ok: false, message: "존재하지 않는 사진입니다." };
        }

        const createdComment: Comment = await prisma.comment.create({
          data: {
            text,
            photo: { connect: { id: photoId } },
            user: { connect: { id: loggedInUser?.id } },
          },
          include: { photo: true, user: true },
        });
        pubsub.publish("COMMENT_UPDATES", { commentUpdates: createdComment });
        return { ok: true, message: "댓글 생성에 성공하였습니다.", id: createdComment.id };
      } catch (error) {
        console.log("createComment error");
        return { ok: false, message: "댓글 생성에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
