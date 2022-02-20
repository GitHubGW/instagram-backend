import { Comment } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface EditCommentArgs {
  commentId: number;
  text: string;
}

interface EditCommentResult {
  ok: boolean;
  message: string;
}

const resolvers: Resolvers = {
  Mutation: {
    editComment: async (_: any, { commentId, text }: EditCommentArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<EditCommentResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundComment: number = await prisma.comment.count({ where: { id: commentId, userId: loggedInUser?.id } });

        if (foundComment === 0) {
          return { ok: false, message: "존재하지 않는 댓글입니다." };
        }

        await prisma.comment.update({ where: { id: commentId }, data: { text } });
        return { ok: true, message: "댓글 수정에 성공하였습니다." };
      } catch (error) {
        console.log("editComment error");
        return { ok: false, message: "댓글 수정에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
