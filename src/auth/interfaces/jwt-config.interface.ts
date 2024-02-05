export interface JWTConfig {
    secret: string;
    audience: string;
    issuer: string;
    accessTokenTtl: number;
    refreshTokenTtl: number;
}
