import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

// Configuration de NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    // Authentification par email/mot de passe avec Supabase
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

        try {
          // Créer un client Supabase SANS authentification pour éviter les conflits
          const supabase = createClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
              auth: {
                autoRefreshToken: false,
                persistSession: false,
              }
            }
          );

          // Vérifier les credentials avec Supabase mais SANS créer de session Supabase
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password
          });

          // Déconnecter immédiatement Supabase pour éviter les conflits de session
          if (authData.user) {
            await supabase.auth.signOut();
          }

          if (authError || !authData.user) {
            console.error('Supabase auth error:', authError);
            return null;
          }

          // Récupérer le profil utilisateur
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          return {
            id: authData.user.id,
            email: authData.user.email!,
            firstName: profile?.first_name || authData.user.user_metadata?.first_name || '',
            lastName: profile?.last_name || authData.user.user_metadata?.last_name || '',
            avatar: profile?.avatar_url || authData.user.user_metadata?.avatar_url,
          };
        } catch (error) {
          console.error('NextAuth authorize error:', error);
          return null;
        }
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
  // Laisser NextAuth gérer les cookies avec ses optimisations par défaut
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
        session.user.id = token.id as string;
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