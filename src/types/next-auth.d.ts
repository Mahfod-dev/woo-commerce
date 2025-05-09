import "next-auth";

declare module "next-auth" {
  /**
   * Extension des types de session Next-Auth
   */
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  }

  /**
   * Extension du type User de Next-Auth
   */
  interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extension de l'objet JWT de Next-Auth
   */
  interface JWT {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
  }
}