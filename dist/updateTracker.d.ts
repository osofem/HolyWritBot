export default class UpdateTracker {
    #private;
    constructor(content: {
        conString: string;
    });
    /**
     * Connect to the database
     */
    connectDB(): Promise<import("mongodb").Db>;
    /**
     * Retrieves update from cache
     * @param updateID update ID to retrieve
     * @returns Returns the object containing the update
     */
    getUpdate(updateID: string): Promise<import("mongodb").WithId<import("bson").Document> | null>;
    /**
     * Save an update to the cache
     * @param updateID update ID to save
     * @param update update contain to save
     * @returns Return updated document
     */
    setUpdate(updateID: string, update: string): Promise<import("mongodb").UpdateResult>;
}
