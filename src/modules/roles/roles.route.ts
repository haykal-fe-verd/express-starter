/**
 * Roles Route Module
 * @description Defines all routes for role management including CRUD operations and permission assignment
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import { router } from "@/application/route";
import { INTERNAL_SERVER_ERROR_SCHEMA, NOT_FOUND_SCHEMA, UNPROCESSABLE_ENTITY_SCHEMA } from "@/lib/constants";
import { CONFLICT, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "@/lib/http-status-codes";
import { authenticate } from "@/middleware/auth";
import { hasPermission } from "@/middleware/permission";
import * as controller from "@/modules/roles/roles.controller";
import {
    assignPermissionsSchema,
    createRoleSchema,
    listQuerySchema,
    roleCreatedResponseSchema,
    roleDetailResponseSchema,
    roleIdParamSchema,
    roleListResponseSchema,
    updateRoleSchema,
} from "@/modules/roles/roles.validation";

const route = router();

const basePath = "/roles";

/**
 * @route GET /roles
 * @description Get all roles with pagination
 * @access Private - Requires roles.read permission
 */
route.get("/", controller.index, {
    name: "roles.index",
    basePath,
    description: "Get list of roles with pagination",
    authenticated: true,
    middleware: [authenticate, hasPermission("roles.read")],
    validation: {
        query: listQuerySchema,
    },
    responses: {
        [OK]: roleListResponseSchema,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route GET /roles/:id
 * @description Get role by ID with permissions and user count
 * @access Private - Requires roles.read permission
 */
route.get("/:id", controller.show, {
    name: "roles.show",
    basePath,
    description: "Get role by ID",
    authenticated: true,
    middleware: [authenticate, hasPermission("roles.read")],
    validation: {
        params: roleIdParamSchema,
    },
    responses: {
        [OK]: roleDetailResponseSchema,
        [NOT_FOUND]: NOT_FOUND_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route POST /roles
 * @description Create a new role
 * @access Private - Requires roles.create permission
 */
route.post("/", controller.store, {
    name: "roles.store",
    basePath,
    description: "Create a new role",
    authenticated: true,
    middleware: [authenticate, hasPermission("roles.create")],
    validation: {
        body: createRoleSchema,
    },
    responses: {
        [CREATED]: roleCreatedResponseSchema,
        [CONFLICT]: UNPROCESSABLE_ENTITY_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route PUT /roles/:id
 * @description Update role by ID
 * @access Private - Requires roles.update permission
 */
route.put("/:id", controller.update, {
    name: "roles.update",
    basePath,
    description: "Update role by ID",
    authenticated: true,
    middleware: [authenticate, hasPermission("roles.update")],
    validation: {
        params: roleIdParamSchema,
        body: updateRoleSchema,
    },
    responses: {
        [OK]: roleCreatedResponseSchema,
        [NOT_FOUND]: NOT_FOUND_SCHEMA,
        [CONFLICT]: UNPROCESSABLE_ENTITY_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route DELETE /roles/:id
 * @description Delete role by ID
 * @access Private - Requires roles.delete permission
 */
route.delete("/:id", controller.destroy, {
    name: "roles.destroy",
    basePath,
    description: "Delete role by ID",
    authenticated: true,
    middleware: [authenticate, hasPermission("roles.delete")],
    validation: {
        params: roleIdParamSchema,
    },
    responses: {
        [OK]: roleCreatedResponseSchema,
        [NOT_FOUND]: NOT_FOUND_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route POST /roles/:id/permissions
 * @description Assign permissions to role
 * @access Private - Requires roles.update permission
 */
route.post("/:id/permissions", controller.assignPermissions, {
    name: "roles.assignPermissions",
    basePath,
    description: "Assign permissions to role",
    authenticated: true,
    middleware: [authenticate, hasPermission("roles.update")],
    validation: {
        params: roleIdParamSchema,
        body: assignPermissionsSchema,
    },
    responses: {
        [OK]: roleDetailResponseSchema,
        [NOT_FOUND]: NOT_FOUND_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

export default route.init();
