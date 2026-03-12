import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "OPERATOR",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Bootstrap: if no approved users exist, first login becomes ADMIN
          const count = await prisma.approvedUser.count();
          if (count === 0) {
            await prisma.approvedUser.create({
              data: {
                email: user.email,
                name: user.name ?? user.email,
                role: "ADMIN",
              },
            });
            return { data: { ...user, role: "ADMIN" } };
          }

          const approved = await prisma.approvedUser.findUnique({
            where: { email: user.email },
          });
          if (!approved) {
            throw new APIError("FORBIDDEN", {
              message: "Email não autorizado para acesso ao sistema.",
            });
          }
          return { data: { ...user, name: approved.name, role: approved.role } };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
          });
          if (!user) throw new APIError("UNAUTHORIZED");

          const approved = await prisma.approvedUser.findUnique({
            where: { email: user.email },
          });
          if (!approved) {
            throw new APIError("FORBIDDEN", {
              message: "Email não autorizado para acesso ao sistema.",
            });
          }

          // Sync role if it changed in ApprovedUser
          if (user.role !== approved.role) {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: approved.role },
            });
          }

          return { data: session };
        },
      },
    },
  },
});
