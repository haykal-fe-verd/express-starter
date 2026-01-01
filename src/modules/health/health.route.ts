/**
 * Health Route Module
 * @author Muhammad Haykal
 * @date 2025-12-31
 */

import { router } from "@/application/route";
import { INTERNAL_SERVER_ERROR_SCHEMA } from "@/lib/constants";
import { INTERNAL_SERVER_ERROR, OK } from "@/lib/http-status-codes";
import * as controller from "@/modules/health/health.controller";
import { healthResponseSchema } from "@/modules/health/health.validation";

const route = router();

const basePath = "/health";

/**
 * GET /health - Health check endpoint
 * @author Muhammad Haykal
 * @date 2025-12-31
 */
route.get("/", controller.index, {
    name: "health.check",
    basePath,
    description: "Health check endpoint to verify service status",
    authenticated: false,
    responses: {
        [OK]: healthResponseSchema,
        [INTERNAL_SERVER_ERROR]: INTERNAL_SERVER_ERROR_SCHEMA,
    },
});

export default route.init();
