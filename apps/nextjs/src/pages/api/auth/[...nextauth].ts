import { NextApiRequest, NextApiResponse } from "next/types";
import NextAuth from "next-auth";
import { getAuthOptions } from "@acme/api";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await NextAuth(req, res, getAuthOptions(req, res));
}
