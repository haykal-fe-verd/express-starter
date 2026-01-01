/**
 * Health Service Module
 * @author Muhammad Haykal
 * @date 2025-12-31
 */

import type { HealthData } from "@/modules/health/health.validation";

/**
 * Health Index
 * @author Muhammad Haykal
 * @date 2025-12-30
 *
 * @returns {Promise<HealthData>}
 */
export const healthIndex = async (): Promise<HealthData> => {
    const health: HealthData = {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
    };

    return health;
};
