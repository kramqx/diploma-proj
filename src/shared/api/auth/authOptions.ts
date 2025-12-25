import crypto from "crypto";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GitLabProvider from "next-auth/providers/gitlab";
import GoogleProvider from "next-auth/providers/google";
import YandexProvider from "next-auth/providers/yandex";
import nodemailer from "nodemailer";

// import { Resend } from "resend";

import { prisma } from "@/shared/api/db/db";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;
const SESSION_UPDATE_AGE = 24 * 60 * 60;
// const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
    maxAge: SESSION_MAX_AGE,
    updateAge: SESSION_UPDATE_AGE,
  },
  providers: [
    // EmailProvider({
    //   from: "no-reply@doxynix.com",
    //   sendVerificationRequest: async ({ identifier, url, provider }) => {
    //     const user = await prisma.user.findUnique({
    //       where: { email: identifier },
    //       select: { emailVerified: true },
    //     });

    //     const template = {
    //       to: identifier,
    //       from: provider.from,
    //       subject: user?.emailVerified ? "Войти в Doxynix" : "Активация аккаунта Doxynix",
    //       html: `
    //         <body>
    //           <h1>Вход в Doxynix</h1>
    //           <p>Нажми на кнопку ниже, чтобы войти:</p>
    //           <a href="${url}" style="background:#000;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
    //             Войти в аккаунт
    //           </a>
    //           <p>Или скопируйте ссылку: ${url}</p>
    //         </body>
    //       `,
    //     };

    //     try {
    //       await resend.emails.send(template);
    //     } catch (error) {
    //       console.error("Resend error:", error);
    //       throw new Error("Failed to send verification email");
    //     }
    //   },
    // }),

    EmailProvider({
      from: process.env.SMTP_USER,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const transporter = nodemailer.createTransport({
          host: "smtp.mail.ru",
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            ciphers: "SSLv3",
          },
        });

        await transporter.sendMail({
          from: provider.from,
          to: email,
          subject: "Doxynix | Авторизация",
          html: `Нам поступил запрос на авторизацию на данный адрес электронной почты, пожалуйста перейдите по следующей ссылке для завершения регистрации:
          ${url}`,
        });
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitLabProvider({
      clientId: process.env.GITLAB_CLIENT_ID!,
      clientSecret: process.env.GITLAB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID!,
      clientSecret: process.env.YANDEX_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session?.user != null) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth",
    signOut: "/",
    error: "/auth/error",
    newUser: "/welcome",
  },

  debug: process.env.NODE_ENV === "development",

  events: {
    async signIn({ user, account }) {
      console.log(`[${account?.provider}] ${user.email} signed in`);
    },
    async signOut({ session }) {
      console.log(`User ${session?.user?.email} signed out`);
    },
    async createUser({ user }) {
      if (user.name == null) {
        const uniqueName = `user-${crypto.randomBytes(3).toString("hex")}`;
        await prisma.user.update({
          where: { id: Number(user.id) },
          data: { name: uniqueName },
        });
        console.log(`New user created: ${user.email} with name ${uniqueName}`);
      } else {
        console.log(`New user created: ${user.email} with name ${user.name}`);
      }
    },
    async updateUser({ user }) {
      console.log(`Update user: ${user.email}`);
    },
    async linkAccount({ user, account }) {
      console.log(`${account.provider} linked to ${user.email}`);
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
