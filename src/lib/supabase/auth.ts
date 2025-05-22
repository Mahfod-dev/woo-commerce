// This file is deprecated - we now use NextAuth for authentication
// All functions here are placeholders or removed to prevent Supabase Auth conflicts

export type AuthCredentials = {
	email: string;
	password: string;
};

export type UserRegistration = AuthCredentials & {
	firstName: string;
	lastName: string;
};

/**
 * @deprecated Use NextAuth signIn instead
 */
export async function signInWithEmail({ email, password }: AuthCredentials) {
	throw new Error('Use NextAuth signIn instead - this function is deprecated');
}

/**
 * @deprecated Use NextAuth and API routes instead
 */
export async function signUpWithEmail({
	email,
	password,
	firstName,
	lastName,
}: UserRegistration) {
	throw new Error('Use /api/auth/register instead - this function is deprecated');
}

/**
 * @deprecated Use NextAuth signOut instead
 */
export async function signOut() {
	throw new Error('Use NextAuth signOut instead - this function is deprecated');
}

/**
 * @deprecated Password reset functionality temporarily disabled
 */
export async function resetPassword(email: string) {
	throw new Error('Password reset functionality temporarily disabled - contact support');
}

/**
 * @deprecated Password update functionality temporarily disabled  
 */
export async function updatePassword(password: string) {
	throw new Error('Password update functionality temporarily disabled - contact support');
}

/**
 * @deprecated Use NextAuth session instead
 */
export async function getCurrentUser() {
	throw new Error('Use NextAuth useSession instead - this function is deprecated');
}