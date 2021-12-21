import { CacheService } from "m3o/cache";
export default class UpdateTracker {
    cache: CacheService;
    cachePrefix: string | undefined;
    constructor(content: {
        m3OKey: string;
    });
    /**
     * Retrieves update from cache
     * @param updateID update ID to retrieve
     * @returns Returns the object containing the update
     */
    getUpdate(updateID: string): Promise<import("m3o/cache").GetResponse>;
    /**
     * Save an update to the cache
     * @param updateID update ID to save
     * @param update update contain to save
     * @returns Return {"status": "ok"} on success
     */
    setUpdate(updateID: string, update: string): Promise<import("m3o/cache").SetResponse>;
}
