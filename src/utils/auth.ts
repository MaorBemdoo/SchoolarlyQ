import NextAuth, { CredentialsSignin } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import User from "@/models/User";
import client from "@/config/mongo";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        class UserNotFoundError extends CredentialsSignin {
          message = "User doesn't exist";
          status = 404;
        }

        class PasswordIncorrectError extends CredentialsSignin {
          message = "Invalid Password";
          status = 400;
        }

        const user = await User.findOne({ username: credentials.username });

        if (!user) {
          throw new UserNotFoundError();
        }

        if (bcrypt.compareSync(credentials.password as string, user.password)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        } else {
          throw new PasswordIncorrectError();
        }
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user = user;
      return session;
    },
  },
});
