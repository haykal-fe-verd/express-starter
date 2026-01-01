/**
 * JWT Utility Module
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import jwt, { type SignOptions } from "jsonwebtoken";
import env from "@/application/env";

export interface JWTPayload {
    userId: string;
    email: string;
}

export interface TokenPair {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
}

/**
 * Generate JWT access token
 * @author Muhammad Haykal
 * @date 2026-01-01
 *
 * @param {JWTPayload} payload
 * @returns {string} JWT token
 */
export const generateAccessToken = (payload: JWTPayload): string => {
    const options: SignOptions = {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };
    return jwt.sign(payload, env.JWT_SECRET, options);
};

/**
 * Generate JWT refresh token
 * @author Muhammad Haykal
 * @date 2026-01-01
 *
 * @param {JWTPayload} payload
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (payload: JWTPayload): string => {
    const options: SignOptions = {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

/**
 * Generate both access and refresh tokens
 * @author Muhammad Haykal
 * @date 2026-01-01
 *
 * @param {JWTPayload} payload
 * @returns {TokenPair} Token pair object
 */
export const generateTokenPair = (payload: JWTPayload): TokenPair => {
    const access_token = generateAccessToken(payload);
    const refresh_token = generateRefreshToken(payload);

    return {
        access_token,
        refresh_token,
        token_type: "Bearer",
        expires_in: env.JWT_EXPIRES_IN,
    };
};

/**
 * Verify JWT access token
 * @author Muhammad Haykal
 * @date 2026-01-01
 *
 * @param {string} token
 * @returns {JWTPayload | null} Decoded payload or null if invalid
 */
export const verifyAccessToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (_error) {
        return null;
    }
};

/**
 * Verify JWT refresh token
 * @author Muhammad Haykal
 * @date 2026-01-01
 *
 * @param {string} token
 * @returns {JWTPayload | null} Decoded payload or null if invalid
 */
export const verifyRefreshToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTPayload;
        return decoded;
    } catch (_error) {
        return null;
    }
};
