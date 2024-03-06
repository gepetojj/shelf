import NextAuth from "next-auth/next";

import { auth } from "@/models/auth";

export default NextAuth(auth);
