import { serialize, parse } from "cookie";
import { addDays, addMinutes } from "date-fns";
import jwt from "jsonwebtoken";
/* import { v4 as uuidv4 } from "uuid"; */
import bcrypt from "bcrypt";
import { db } from "~/db";

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
/* export const verifyToken = (
  token: string | undefined | null
): TToken | null => {
  if (!token) return null;

  try {
    const verified = jwt.verify(
      token,
      process.env.COOKIE_JWT_SECRET as string,
      {
        algorithms: ["HS256"],
      }
    );

    if (
      typeof verified === "object" &&
      "tokenId" in verified &&
      "userId" in verified
    ) {
      return verified as TToken;
    }

    return null;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
 */
