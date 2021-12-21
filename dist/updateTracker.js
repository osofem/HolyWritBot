"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("m3o/cache");
class UpdateTracker {
    constructor(content) {
        this.cachePrefix = process.env.cachePrefix;
        this.cache = new cache_1.CacheService(content.m3OKey);
    }
    /**
     * Retrieves update from cache
     * @param updateID update ID to retrieve
     * @returns Returns the object containing the update
     */
    getUpdate(updateID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cache.get({
                key: this.cachePrefix + updateID
            });
        });
    }
    /**
     * Save an update to the cache
     * @param updateID update ID to save
     * @param update update contain to save
     * @returns Return {"status": "ok"} on success
     */
    setUpdate(updateID, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cache.set({
                key: this.cachePrefix + updateID,
                value: update,
                ttl: 7 * 24 * 60 * 60 // 7days validity. Automatically deletes after 7 days
            });
        });
    }
}
exports.default = UpdateTracker;
module.exports = UpdateTracker;
