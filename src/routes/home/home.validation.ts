/**
 * Home page validation schemas.
 * @author Muhammad Haykal
 * @date 2025-12-26
 */

export const homeSchema = {
    responses: {
        200: {
            description: "Home page HTML",
            content: {
                "text/html": {
                    schema: {
                        type: "string",
                        example: "<!DOCTYPE html>...",
                    },
                },
            },
        },
    },
};
