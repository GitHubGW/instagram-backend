import { User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SearchUsersArgs {
  username: string;
  cursor?: string;
}

interface SearchUsersResult extends CommonResult {
  users?: User[];
}

const resolvers: Resolvers = {
  Query: {
    searchUsers: async (_, { username, cursor }: SearchUsersArgs, { prisma }: Context): Promise<SearchUsersResult> => {
      try {
        if (username === "") {
          throw new Error();
        }

        const foundUsers: User[] = await prisma.user.findMany({
          where: { username: { contains: username.toLowerCase() } },
          cursor: cursor === undefined ? undefined : { username: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 20,
        });
        return { ok: true, message: "유저 검색에 성공하였습니다.", users: foundUsers };
      } catch (error) {
        console.log("searchUsers error");
        return { ok: false, message: "유저 검색에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
