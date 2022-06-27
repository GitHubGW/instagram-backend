import { Photo } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeRecommendPhotosResult extends CommonResult {
  photos: Photo[];
}

const resolvers: Resolvers = {
  Query: {
    seeRecommendPhotos: async (_, __, { prisma }: Context): Promise<SeeRecommendPhotosResult> => {
      try {
        const foundPhotos: Photo[] = await prisma.photo.findMany({ take: 25 });
        return { ok: true, message: "추천 사진 보기에 성공하였습니다.", photos: foundPhotos };
      } catch (error) {
        console.log("seeRecommendPhotos error");
        return { ok: false, message: "추천 사진 보기에 실패하였습니다.", photos: [] };
      }
    },
  },
};

export default resolvers;
