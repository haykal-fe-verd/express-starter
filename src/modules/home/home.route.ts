/**
 * Home Route Module
 * @description Route definitions for home/landing page
 * @author Muhammad Haykal
 * @date 2026-01-01
 */

import { router } from "@/application/route";
import * as controller from "@/modules/home/home.controller";

const route = router();

const basePath = "";

/**
 * @route GET /
 * @description Landing page showcasing the Express starter template
 * @access Public
 * @author Muhammad Haykal
 * @date 2026-01-01
 */
route.get("/", controller.index, {
    name: "home.index",
    basePath,
    description: "Landing page with starter template information and features",
    authenticated: false,
});

export const path = "/";
export default route.init();
