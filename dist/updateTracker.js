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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _UpdateTracker_dbName, _UpdateTracker_cacheCollection, _UpdateTracker_monClient;
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class UpdateTracker {
    constructor(content) {
        _UpdateTracker_dbName.set(this, process.env.dbName ? process.env.dbName : "devHolyWrit");
        _UpdateTracker_cacheCollection.set(this, process.env.cachePrefix ? process.env.cachePrefix : "devHolyWritCacheUpdate");
        _UpdateTracker_monClient.set(this, void 0);
        __classPrivateFieldSet(this, _UpdateTracker_monClient, new mongodb_1.MongoClient(content.conString), "f");
    }
    /**
     * Connect to the database
     */
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _UpdateTracker_monClient, "f").connect();
            return __classPrivateFieldGet(this, _UpdateTracker_monClient, "f").db(__classPrivateFieldGet(this, _UpdateTracker_dbName, "f"));
        });
    }
    /**
     * Retrieves update from cache
     * @param updateID update ID to retrieve
     * @returns Returns the object containing the update
     */
    getUpdate(updateID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the cache collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _UpdateTracker_cacheCollection, "f"));
            const cache = yield collection.findOne({ updateID });
            __classPrivateFieldGet(this, _UpdateTracker_monClient, "f").close();
            return cache;
        });
    }
    /**
     * Save an update to the cache
     * @param updateID update ID to save
     * @param update update contain to save
     * @returns Return updated document
     */
    setUpdate(updateID, update) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the cache collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _UpdateTracker_cacheCollection, "f"));
            const result = yield collection.updateOne({ updateID }, { $set: { update, ttl: +new Date() } }, { upsert: true });
            __classPrivateFieldGet(this, _UpdateTracker_monClient, "f").close();
            return result;
        });
    }
}
exports.default = UpdateTracker;
_UpdateTracker_dbName = new WeakMap(), _UpdateTracker_cacheCollection = new WeakMap(), _UpdateTracker_monClient = new WeakMap();
module.exports = UpdateTracker;
