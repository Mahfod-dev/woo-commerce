import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authenticateUser, findUserByEmail } from "@/lib/userService";

// Configuration de NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    // Authentification par email/mot de passe
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        // Utiliser notre service d'authentification
        const user = authenticateUser(
          credentials.email,
          credentials.password
        );

        if (user) {
          // Le mot de passe est déjà retiré dans le service d'authentification
          return user as any;
        }

        return null;
      },
    }),
    // Pour ajouter l'authentification Google en production:
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  // Configurer les cookies pour une sécurité et persistance optimales
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 // 30 jours
      }
    },
  },
  callbacks: {
    // Ajouter des informations supplémentaires au token JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.avatar = user.avatar;
      }
      return token;
    },
    // Ajouter des informations supplémentaires à la session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as number;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.avatar = token.avatar as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",        // Page de connexion personnalisée
    signOut: "/",           // Redirection après déconnexion
    error: "/login",        // Page d'erreur d'authentification
  },
  debug: process.env.NODE_ENV === "development",
};

// Créer le gestionnaire d'API
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };