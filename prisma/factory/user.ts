/**
 * User Factory - Generate fake user data for testing and seeding
 * @author Muhammad Haykal
 * @date 2025-12-28
 */

import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    email_verified_at?: Date | null;
    remember_token?: string | null;
}

/**
 * Generate a single fake user
 */
export async function generateUser(overrides?: Partial<CreateUserData>): Promise<CreateUserData> {
    const hashedPassword = await bcrypt.hash("password", 10);

    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        email_verified_at: faker.helpers.maybe(() => faker.date.past(), { probability: 0.7 }),
        remember_token: faker.helpers.maybe(() => faker.string.alphanumeric(100), { probability: 0.3 }),
        ...overrides,
    };
}

/**
 * Generate multiple fake users
 */
export async function generateUsers(count: number, overrides?: Partial<CreateUserData>): Promise<CreateUserData[]> {
    const users: CreateUserData[] = [];

    for (let i = 0; i < count; i++) {
        users.push(await generateUser(overrides));
    }

    return users;
}

/**
 * Generate a verified user
 */
export async function generateVerifiedUser(overrides?: Partial<CreateUserData>): Promise<CreateUserData> {
    return generateUser({
        email_verified_at: new Date(),
        ...overrides,
    });
}

/**
 * Generate an unverified user
 */
export async function generateUnverifiedUser(overrides?: Partial<CreateUserData>): Promise<CreateUserData> {
    return generateUser({
        email_verified_at: null,
        ...overrides,
    });
}
