import { MongoClient } from 'mongodb'

export default class UpdateTracker{
    #dbName = process.env.dbName?process.env.dbName:"xnHolyWrit";
    #cacheCollection = process.env.cachePrefix?process.env.cachePrefix:"xnHolyWritCacheUpdate";
    #monClient;

    constructor(content: {conString: string}){
        this.#monClient = new MongoClient(content.conString);
    }

    /**
     * Connect to the database
     */
     async connectDB(){
        await this.#monClient.connect();
        return this.#monClient.db(this.#dbName);
    }

    /**
     * Retrieves update from cache
     * @param updateID update ID to retrieve
     * @returns Returns the object containing the update
     */
    async getUpdate(updateID: string) {
        //Connect to the cache collection
        const collection = (await this.connectDB()).collection(this.#cacheCollection);
        const cache = await collection.findOne({updateID});
        this.#monClient.close();

        return cache;
    }

    /**
     * Save an update to the cache
     * @param updateID update ID to save
     * @param update update contain to save
     * @returns Return updated document
     */
    async setUpdate(updateID: string, update: string) {
        //Connect to the cache collection
        const collection = (await this.connectDB()).collection(this.#cacheCollection);
        const result = await collection.updateOne({updateID}, {$set:{update, ttl: +new Date()}}, {upsert: true})
        this.#monClient.close();
        
        return result;
    }
}

module.exports = UpdateTracker;