export type LoginInput = {
  username: string;
  password: string;
  portal: string;
};

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
