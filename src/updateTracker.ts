import { CacheService } from "m3o/cache";

export default class UpdateTracker{
    cache; cachePrefix = process.env.cachePrefix;

    constructor(content: {m3OKey: string}){
        this.cache = new CacheService(content.m3OKey);
    }

    /**
     * Retrieves update from cache
     * @param updateID update ID to retrieve
     * @returns Returns the object containing the update
     */
    async getUpdate(updateID: string) {
        return await this.cache.get({
            key: this.cachePrefix+updateID
        });
    }

    /**
     * Save an update to the cache
     * @param updateID update ID to save
     * @param update update contain to save
     * @returns Return {"status": "ok"} on success
     */
    async setUpdate(updateID: string, update: string) {
        return await this.cache.set({
            key: this.cachePrefix+updateID,
            value: update,
            ttl: 7*24*60*60 // 7days validity. Automatically deletes after 7 days
        });
    }
}

module.exports = UpdateTracker;