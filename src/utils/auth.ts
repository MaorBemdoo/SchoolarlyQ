import NextAuth, { CredentialsSignin, User as UserType } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
// import clientPromise from "@/config/mongo";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { AdapterUser } from "next-auth/adapters";
import initLogger from "@/config/logger";
import { userService } from "@/services/user.service";
import connectDB from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  logger: {
    async error(error) {
      (await initLogger()).error(error);
    },
    async warn(code) {
      (await initLogger()).warn(code);
    },
    async debug(message, metadata) {
      (await initLogger()).debug(metadata, message);
    },
  },
  // adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        const logger = await initLogger();
        const user = await userService.getUserByEmail(profile?.email);

        if (!user) {
          const result = await userService.createUser({
            full_name: profile?.name,
            username: profile?.email.split("@")[0],
            email: profile?.email,
          });
          logger.info("User created with google successfully");
          return result.toObject();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...user.toObject(), password: undefined } as any;
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        usernameOrEmailOrMatric: {
          label: "Username or Email or Matric Number",
          type: "text",
        },
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

        await connectDB();

        const user =
          (await userService.getUserByUsername(
            credentials.usernameOrEmailOrMatric as string,
          )) ||
          (await userService.getUserByEmail(
            credentials.usernameOrEmailOrMatric as string,
          )) ||
          (await userService.getUserByMatricNumber(
            credentials.usernameOrEmailOrMatric as string,
          ));

        if (!user) {
          throw new UserNotFoundError();
        }

        if (bcrypt.compareSync(credentials.password as string, user.password)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          user.password = undefined;
          return user;
        } else {
          throw new PasswordIncorrectError();
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    session({ session, token, user }) {
      session.user = token.user as UserType & AdapterUser;
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});
