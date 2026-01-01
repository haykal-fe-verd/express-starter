/**
 * Permissions Route Module
 * @description Defines all routes for permission management including CRUD operations
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import { router } from "@/application/route";
import { INTERNAL_SERVER_ERROR_SCHEMA, NOT_FOUND_SCHEMA, UNPROCESSABLE_ENTITY_SCHEMA } from "@/lib/constants";
import { CONFLICT, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "@/lib/http-status-codes";
import { authenticate } from "@/middleware/auth";
import { hasPermission } from "@/middleware/permission";
import * as controller from "@/modules/permissions/permissions.controller";
import {
    createPermissionSchema,
    listQuerySchema,
    permissionCreatedResponseSchema,
    permissionDetailResponseSchema,
    permissionIdParamSchema,
    permissionListResponseSchema,
    updatePermissionSchema,
} from "@/modules/permissions/permissions.validation";

const route = router();

const basePath = "/permissions";

/**
 * @route GET /permissions
 * @description Get all permissions with pagination
 * @access Private - Requires permissions.read permission
 */
route.get("/", controller.index, {
    name: "permissions.index",
    basePath,
    description: "Get list of permissions with pagination",
    authenticated: true,
    middleware: [authenticate, hasPermission("permissions.read")],
    validation: {
        query: listQuerySchema,
    },
    responses: {
        [OK]: permissionListResponseSchema,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route GET /permissions/:id
 * @description Get permission by ID with associated roles
 * @access Private - Requires permissions.read permission
 */
route.get("/:id", controller.show, {
    name: "permissions.show",
    basePath,
    description: "Get permission by ID",
    authenticated: true,
    middleware: [authenticate, hasPermission("permissions.read")],
    validation: {
        params: permissionIdParamSchema,
    },
    responses: {
        [OK]: permissionDetailResponseSchema,
        [NOT_FOUND]: NOT_FOUND_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route POST /permissions
 * @description Create a new permission
 * @access Private - Requires permissions.create permission
 */
route.post("/", controller.store, {
    name: "permissions.store",
    basePath,
    description: "Create a new permission",
    authenticated: true,
    middleware: [authenticate, hasPermission("permissions.create")],
    validation: {
        body: createPermissionSchema,
    },
    responses: {
        [CREATED]: permissionCreatedResponseSchema,
        [CONFLICT]: UNPROCESSABLE_ENTITY_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route PUT /permissions/:id
 * @description Update permission by ID
 * @access Private - Requires permissions.update permission
 */
route.put("/:id", controller.update, {
    name: "permissions.update",
    basePath,
    description: "Update permission by ID",
    authenticated: true,
    middleware: [authenticate, hasPermission("permissions.update")],
    validation: {
        params: permissionIdParamSchema,
        body: updatePermissionSchema,
    },
    responses: {
        [OK]: permissionCreatedResponseSchema,
        [NOT_FOUND]: NOT_FOUND_SCHEMA,
        [CONFLICT]: UNPROCESSABLE_ENTITY_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

/**
 * @route DELETE /permissions/:id
 * @description Delete permission by ID
 * @access Private - Requires permissions.delete permission
 */
route.delete("/:id", controller.destroy, {
    name: "permissions.destroy",
    basePath,
    description: "Delete permission by ID",
    authenticated: true,
    middleware: [authenticate, hasPermission("permissions.delete")],
    validation: {
        params: permissionIdParamSchema,
    },
    responses: {
        [OK]: permissionCreatedResponseSchema,
        [NOT_FOUND]: NOT_FOUND_SCHEMA,
        [UNPROCESSABLE_ENTITY]: UNPROCESSABLE_ENTITY_SCHEMA,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

export default route.init();
