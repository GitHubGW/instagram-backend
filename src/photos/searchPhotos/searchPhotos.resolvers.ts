import { Photo } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface SearchPhotosArgs {
  keyword: string;
  cursor?: number;
}

interface SearchPhotosResult {
  ok: boolean;
  message: string;
  photos?: Photo[];
}

const resolvers: Resolvers = {
  Query: {
    searchPhotos: async (_: any, { keyword, cursor }: SearchPhotosArgs, { prisma }: Context): Promise<SearchPhotosResult> => {
      try {
        const foundPhotos: Photo[] = await prisma.photo.findMany({
          where: { caption: { contains: keyword } },
          cursor: cursor === undefined ? undefined : { id: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 9,
        });
        return { ok: true, message: "사진 검색에 성공하였습니다.", photos: foundPhotos };
      } catch (error) {
        console.log("searchPhotos error");
        return { ok: false, message: "사진 검색에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
