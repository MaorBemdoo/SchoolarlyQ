import NextAuth, { CredentialsSignin, User as UserType } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import User from "@/models/User";
// import clientPromise from "@/config/mongo";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import connectDB from "./db";
import { AdapterUser } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        console.log(profile);
        return { ...profile };
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
          (await User.findOne({
            username: credentials.usernameOrEmailOrMatric,
          })) ||
          (await User.findOne({
            email: credentials.usernameOrEmailOrMatric,
          })) ||
          (await User.findOne({
            matric_number: credentials.usernameOrEmailOrMatric,
          }));

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn({ account, profile }) {
      // if (account?.provider == "google") {
      //   class EmailNotFoundError {
      //     message = "User doesn't exist";
      //     status = 404;
      //   }

      //   const user = await User.findOne({ email: profile?.email });

      //   if (!user) {
      //     throw new EmailNotFoundError();
      //   }

      // }
      return true;
    },
  },
});
