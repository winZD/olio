import { serialize, parse } from "cookie";
import { addDays, addMinutes } from "date-fns";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { db } from "~/db";
import { redirect } from "@remix-run/node";

type TToken = {
  tokenId: string;
  userId: string;
};

const generateAccessToken = (data: TToken) =>
  jwt.sign(data, process.env.COOKIE_JWT_SECRET as string, {
    expiresIn: "30min",
  });

const generateRefreshToken = (data: TToken) =>
  jwt.sign(data, process.env.COOKIE_JWT_SECRET as string, {
    expiresIn: "30d",
  });

export const verifyToken = (
  token: string | undefined | null
): TToken | null => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.COOKIE_JWT_SECRET as string, {
      algorithms: ["HS256"],
    }) as TToken;
  } catch (error) {
    console.error(token, "Token verification failed:", error);
    return null;
  }
};

export const getUserFromRequest = async (request: Request) => {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const at = verifyToken(cookies["at"]);
  if (at) {
    return await db.userTable.findUniqueOrThrow({
      where: { id: at.userId },
    });
  } else {
    const rt = verifyToken(cookies["rt"]);
    if (rt) {
      return await db.userTable.findUniqueOrThrow({
        where: { id: rt.userId },
      });
    } else {
      return null;
    }
  }
};

export const revokeOldRefreshToken = async (tokenId: string) => {
  console.log("revokeOldRefreshToken");
  try {
    await db.refreshTokenTable.update({
      where: { id: tokenId },
      data: { status: "REVOKED" },
    });
  } catch (e) {
    throw redirect("/logout");
  }
};

export const createNewTokens = async (userId: string, familyId?: string) => {
  console.log("createNewTokens");

  const tokenId = uuidv4();
  const accessToken = generateAccessToken({ tokenId, userId });
  const refreshToken = generateRefreshToken({ tokenId, userId });

  await db.refreshTokenTable.create({
    data: {
      id: tokenId,
      userId,
      createdAt: new Date(),
      expiresAt: addDays(new Date(), 30),
      familyId: familyId || tokenId,
      token: refreshToken,
      status: "GRANTED",
    },
  });

  return { accessToken, refreshToken };
};
