import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  //JWT is the token type
  interface JWT {
    user: User;
  }
}
