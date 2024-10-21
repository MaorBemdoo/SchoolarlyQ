import NextAuth, { CredentialsSignin } from 'next-auth';
import bcrypt from 'bcryptjs';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import User from '@/models/User';
import connectDB from '@/config/mongo';

export const { handlers, signIn, signOut, auth } =  NextAuth({
    adapter: MongoDBAdapter(connectDB),
    providers: [
        Google({

        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                class UserNotFoundError extends CredentialsSignin {
                    message = "User doesn't exist"
                    status = 404
                }

                class PasswordIncorrectError extends CredentialsSignin {
                    message = "Invalid Password"
                    status = 400
                }

                const user = await User.findOne({ username: credentials.username });

                if(!user){
                    throw new UserNotFoundError()
                }

                if (bcrypt.compareSync(credentials.password as string, user.password)) {
                    return {
                        id: user._id,
                        username: user.username,
                        full_name: user.full_name,
                        favourites: user.favourites,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    }
                } else {
                    throw new PasswordIncorrectError()
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
});