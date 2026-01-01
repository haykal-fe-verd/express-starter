/**
 * Users Route Module
 * @description Route definitions for user management endpoints
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import { router } from "@/application/route";
import { INTERNAL_SERVER_ERROR_SCHEMA, NOT_FOUND_SCHEMA, UNPROCESSABLE_ENTITY_SCHEMA } from "@/lib/constants";
import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "@/lib/http-status-codes";
import { authenticate } from "@/middleware/auth";
import { hasPermission } from "@/middleware/permission";
import * as controller from "@/modules/users/users.controller";
import {
    createUserSchema,
    listQuerySchema,
    updateUserSchema,
    userCreatedResponseSchema,
    userDetailResponseSchema,
    userIdParamSchema,
    userListResponseSchema,
} from "@/modules/users/users.validation";

const route = router();

const basePath = "/users";

/**
 * @route GET /users
 * @description Get list of users with pagination
 * @access Authenticated (Permission: users.read)
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
route.get("/", controller.index, {
    name: "users.index",
    basePath,
    description: "Get list of users with pagination",
    authenticated: true,
    middleware: [authenticate, hasPermission("users.read")],
    validation: {
        query: listQuerySchema,
    },
    responses: {
        [OK]: userListResponseSchema,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route GET /users/:id
 * @description Get user by ID
 * @access Authenticated (Permission: users.read)
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
route.get("/:id", controller.show, {
    name: "users.show",
    basePath,
    description: "Get user by ID",
    authenticated: true,
    middleware: [authenticate, hasPermission("users.read")],
    validation: {
        params: userIdParamSchema,
    },
    responses: {
        [OK]: userDetailResponseSchema,
        [NOT_FOUND]: NOT_FOUND_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route POST /users
 * @description Create a new user
 * @access Authenticated (Permission: users.create)
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
route.post("/", controller.store, {
    name: "users.store",
    basePath,
    description: "Create a new user",
    authenticated: true,
    middleware: [authenticate, hasPermission("users.create")],
    validation: {
        body: createUserSchema,
    },
    responses: {
        [CREATED]: userCreatedResponseSchema,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route PUT /users/:id
 * @description Update user by ID
 * @access Authenticated (Permission: users.update)
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
route.put("/:id", controller.update, {
    name: "users.update",
    basePath,
    description: "Update user by ID",
    authenticated: true,
    middleware: [authenticate, hasPermission("users.update")],
    validation: {
        params: userIdParamSchema,
        body: updateUserSchema,
    },
    responses: {
        [OK]: userDetailResponseSchema,
        [NOT_FOUND]: NOT_FOUND_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route DELETE /users/:id
 * @description Delete user by ID
 * @access Authenticated (Permission: users.delete)
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
route.delete("/:id", controller.destroy, {
    name: "users.destroy",
    basePath,
    description: "Delete user by ID",
    authenticated: true,
    middleware: [authenticate, hasPermission("users.delete")],
    validation: {
        params: userIdParamSchema,
    },
    responses: {
        [OK]: userDetailResponseSchema,
        [NOT_FOUND]: NOT_FOUND_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

export default route.init();
