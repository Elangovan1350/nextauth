import prisma from "@/lib/prisma";
import nextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOption: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "USER NAME",
          placeholder: "Your User Name",
          type: "text",
        },
        password: {
          label: "PASSWORD",
          type: "password",
          placeholder: "Passeord",
        },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.username,
          },
        });
        if (!user) throw new Error("user is not found");

        // const isPasswordCorrect = credentials?.password === user.password;
        // if (!isPasswordCorrect) throw new Error("password is not correct");
        if (!credentials?.password) throw new Error("please provide password");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) throw new Error("password is not correct");

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
};

const handler = nextAuth(authOption);

export { handler as GET, handler as POST };
