/**
 * Set of routes that are accessible to public and don't require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    
]

/**
 * Set of routes that are accessible to used for authentication
 * These routes redirect users to the entire application private routes
 * @type {string[]}
 */

export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error"
]

/**
 * The prefix for API authentication routes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth"

/**
 * Default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings"