import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface DeleteCommentArgs {
  commentId: number;
}

const resolvers: Resolvers = {
  Mutation: {
    deleteComment: async (_, { commentId }: DeleteCommentArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CommonResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const countedComment: number = await prisma.comment.count({ where: { id: commentId, userId: loggedInUser?.id } });

        if (countedComment === 0) {
          return { ok: false, message: "존재하지 않는 댓글입니다." };
        }

        await prisma.comment.delete({ where: { id: commentId } });
        return { ok: true, message: "댓글 삭제에 성공하였습니다.", id: commentId };
      } catch (error) {
        console.log("deleteComment error");
        return { ok: false, message: "댓글 삭제에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
