import { z } from 'zod';

export const loginInputSchema = z.object({
  username: z
    .string()
    .min(1, 'Username or email is required')
    .refine(
      (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val) || val.length >= 3;
      },
      { message: 'Please enter a valid username or email address' },
    ),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  portal: z
    .string()
    .min(1, 'Portal is required')
    .transform((val) => val.trim()),
});

// Response type definition (no strict validation - we extract data manually)
export const loginResponseSchema = z.any(); // Just for type inference, not for validation

export type LoginInput = z.infer<typeof loginInputSchema>;

// Define LoginResponse type manually since we're not using strict Zod validation
export type LoginResponse = {
  message?: string;
  user: {
    id: number;
    guid?: string;
    domain?: string;
    ldap_dn?: string;
    name: string;
    email?: string | null;
    username: string;
    status?: string;
    last_login_at?: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    two_factor_secret?: string | null;
    two_factor_recovery_codes?: string | null;
    two_factor_confirmed_at?: string | null;
  };
  access_token: {
    accessTokenId?: string;
    tokenType?: string;
    expiresIn?: number;
    accessToken: string;
  };
  token_type?: string;
};
