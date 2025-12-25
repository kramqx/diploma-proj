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

const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 дней
const SESSION_UPDATE_AGE = 24 * 60 * 60; // сутки
const MAGIC_LINK_MAX_AGE = 10 * 60; // 10 минут
const NODEMAILER_PORT = 465;
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
    //   maxAge: MAGIC_LINK_MAX_AGE,
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
      maxAge: MAGIC_LINK_MAX_AGE,
      from: process.env.SMTP_USER,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const { host } = new URL(url);
        const transporter = nodemailer.createTransport({
          host: "smtp.mail.ru",
          port: NODEMAILER_PORT,
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
          html: `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #e5e5e5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111111;">
            <tr>
              <td style="padding:26px 32px 10px;">
                <h2 style="margin:0 0 14px;font-size:20px;line-height:1.4;color:#111111;">Подтверждение входа</h2>

                <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#111111;">
                  На этот адрес был отправлен запрос на авторизацию в <strong>${host}</strong>.
                </p>

                <p style="margin:0 18px 22px 0;font-size:15px;line-height:1.6;">
                  Нажмите кнопку ниже, чтобы завершить вход. Ссылка действует ограниченное время.
                </p>

                <p style="text-align:center;margin:26px 0;">
                  <a
                    href="${url}"
                    style="
                      display:inline-block;
                      background:#000000;
                      color:#ffffff;
                      text-decoration:none;
                      padding:12px 22px;
                      border-radius:8px;
                      font-weight:600;
                      font-size:14px;
                    "
                  >
                    Войти
                  </a>
                </p>

                <p style="margin:22px 0 10px;font-size:13px;color:#555555;line-height:1.6;">
                  Если кнопка не работает, скопируйте ссылку и вставьте в адресную строку браузера:
                </p>

                <p style="word-break:break-all;font-size:13px;color:#111111;margin:0 0 24px;">
                  ${url}
                </p>

                <p style="font-size:12px;color:#888888;line-height:1.6;margin:0;">
                  Если вы не запрашивали вход — просто проигнорируйте это письмо.
                </p>
              </td>
            </tr>
          </table>

          <p style="color:#888888;font-size:12px;margin:14px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            © ${host}
          </p>
        </td>
      </tr>
    </table>
  `,
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
    error: "/auth/error", // реализовать страницу /auth/error
    newUser: "/welcome", // реализовать страницу /welcome
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
      if (user.name == null && user.email != null) {
        const baseName = user.email.split("@")[0];
        const finalName = `${baseName}`;

        await prisma.user.update({
          where: { id: Number(user.id) },
          data: { name: finalName },
        });
        console.log(`New user created: ${user.email} with name ${finalName}`);
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
