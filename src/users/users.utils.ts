import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { User } from ".prisma/client";

export const handleGetLoggedInUser = async (token: string | string[] | undefined): Promise<User | null> => {
  try {
    if (token === undefined) {
      throw new Error();
    }

    const decodedPayload: any = await jwt.verify(token as string, process.env.JWT_SECRET_KEY as string);
    const foundUser: User | null = await prisma.user.findUnique({ where: { id: decodedPayload?.id } });

    if (foundUser === null) {
      throw new Error();
    }

    return foundUser;
  } catch (error) {
    console.log("로그인하지 않은 유저입니다.");
    return null;
  }
};

export const handleCheckLogin = (loggedInUser: User | null): void => {
  if (loggedInUser === null) {
    console.log("로그인이 필요합니다.");
    throw new Error();
  }
};
