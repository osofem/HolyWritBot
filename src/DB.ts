import { InsertOneResult, MongoClient, UpdateResult, WithId } from 'mongodb'

export default class DB{
    #monClient;
    #dbName = process.env.dbName?process.env.dbName:"xnHolyWrit";
    #usersCollection = process.env.usersTable?process.env.usersTable:"xnUsers";
    #versesCountCollection = process.env.versesCountTable?process.env.versesCountTable:"xnVerseCount";
    #readoutCountCollection = process.env.readoutCountTable?process.env.readoutCountTable:"xnReadoutCount";
    #searchCountCollection = process.env.searchCountTable?process.env.searchCountTable:"xnSearchCount";


    /**
     * Constructor for the MongoDB service
     * @param conString MongoDBconnection string
     */
    constructor(conString: string){
        this.#monClient = new MongoClient(conString);
    }


    /**
     * Connect to the database
     */
    async connectDB(){
        await this.#monClient.connect();
        return this.#monClient.db(this.#dbName);
    }


    /***+++++++++++++++++++++
        USER
    ++++++++++++++++++++++++***/

    /**
     * Create document of a user in the collection
     * @param userID ID of the user
     * @returns Returns the record created
     */
    async createUser(userID: string): Promise<InsertOneResult<Document>>{
        //Connect to the user collection
        const collection = (await this.connectDB()).collection(this.#usersCollection);

        //Create the document
        let record = {
            userID,
            firstAccess: +new Date(),
            lastAccess: +new Date(),
            edition: 'kjv',
            voiceID: "ID1"
        };

        //Save new user and close the connection
        const newUser = await collection.insertOne(record);
        this.#monClient.close();

        return newUser
    }

    /**
     * Retrive a user from the users collection
     * @param userID ID of the user
     * @returns Returns a document of the user from the collection
     */
    async getUser(userID: string){
        //Connect to the user collection
        const collection = (await this.connectDB()).collection(this.#usersCollection);

        //Create the read request
        let filter = {
            userID
        };

        //Retrieve the user and close the connection
        const user = await collection.findOne(filter);
        this.#monClient.close();

        return user;
    }

    /**
     * Updates a user infomation in the collection
     * @param userID ID of the user
     * @param content contents to update
     * @returns Returns a document of the updated user
     */
     async updateUser(userID: string, content: any): Promise<UpdateResult> {
        //Connect to the user collection
        const collection = (await this.connectDB()).collection(this.#usersCollection);

        const updatedUser = await collection.updateOne({userID}, {$set: {...content}}, { upsert: true });
        this.#monClient.close();

        return updatedUser;
    }

    /**
     * Gets the total number of users for the bot
     * @returns Returns the total bot users
     */
    async getTotalUsers(): Promise<number>{
        //Connect to the user collection
        const collection = (await this.connectDB()).collection(this.#usersCollection);

        const totalUsers = await collection.countDocuments();
        this.#monClient.close();

        return totalUsers;
    }

    /**
     * Change the bible edition for a user
     * @param userID User ID
     * @param edition Edition to change to
     * @returns Returns the updated user
     */
    async changeEdition(userID: string, edition: string): Promise<UpdateResult>{
        //Connect to the user collection
        const collection = (await this.connectDB()).collection(this.#usersCollection);

        const updatedUser = await collection.updateOne({userID}, {$set : {edition}}, {upsert: true});
        this.#monClient.close();
        
        return updatedUser;
    }

    /**
     * Change the readout voice
     * @param userID User ID
     * @param voiceID ID of voice to change to
     * @returns Returns the updated user
     */
     async changeVoiceReadout(userID: string, voiceID: string): Promise<UpdateResult>{
        //Connect to the user collection
        const collection = (await this.connectDB()).collection(this.#usersCollection);

        const updatedUser = await collection.updateOne({userID}, {$set: {voiceID}}, {upsert: true});
        this.#monClient.close();
        
        return updatedUser;
    }
    
    
    /**
     * Get the edition for the user
     * @param userID ID of the user
     * @returns Returns the current edition the selected user
     */
    async getCurrentEdition(userID: string): Promise<string>{
        //Connect to the user collection
        const collection = (await this.connectDB()).collection(this.#usersCollection);
        const user = await collection.findOne({userID});
        this.#monClient.close();

        if(user != null)
            return user['edition']!=undefined?user['edition']:'kjv';
        else
            return "kjv";
    }

    /**
     * Get the current voice ID
     * @param userID ID of the user
     * @returns Returns the current voice ID the selected user
     */
     async getCurrentVoiceID(userID: string): Promise<string>{
        //Connect to the user collection
        const collection = (await this.connectDB()).collection(this.#usersCollection);
        const user = await collection.findOne({userID});
        this.#monClient.close();

        if(user != null)
            return user['voiceID']!=undefined?user['voiceID']:'ID1';
        else
            return "ID1";
    }

    /***+++++++++++++++++++++
        VERSE COUNT
    ++++++++++++++++++++++++***/

    /**
     * Save the verse request to collection
     * @param verse Verse requested
     * @returns Returns inserted document
     */
    async setVerse(verse: string): Promise<InsertOneResult<Document>>{
        //Connect to the verseCount collection
        const collection = (await this.connectDB()).collection(this.#versesCountCollection);
        const result = await collection.insertOne({verse, time: +new Date()});
        this.#monClient.close();

        return result;
    }

    /**
     * Get total verses searched
     * @returns Returns total number of verses searched
     */
    async getTotalVerseCount(): Promise<number> {
        //Connect to the verseCount collection
        const collection = (await this.connectDB()).collection(this.#versesCountCollection);
        const totalVerses = await collection.countDocuments();
        this.#monClient.close();
        return totalVerses;
    }

    /***+++++++++++++++++++++
        READOUT COUNT
    ++++++++++++++++++++++++***/

    /**
     * Save the readout requests to the collection
     * @param verse Verse to readout
     * @returns Returns the saved document
     */
    async setReadout(verse: string): Promise<InsertOneResult<Document>>{
        //Connect to the readoutCount collection
        const collection = (await this.connectDB()).collection(this.#readoutCountCollection);
        const result = await collection.insertOne({verse, time: +new Date()});
        this.#monClient.close();

        return result
    }

    /**
     * Gets the total readouts requested
     * @returns Returns the total readout count
     */
    async getTotalReadoutCount(): Promise<number> {
        //Connect to the readoutCount collection
        const collection = (await this.connectDB()).collection(this.#readoutCountCollection);
        const totalReadout = await collection.countDocuments();
        this.#monClient.close();
        return totalReadout;
    }

    /***+++++++++++++++++++++
        SEARCH COUNT
    ++++++++++++++++++++++++***/

    /**
     * Save the search term to the collection
     * @param searchTerm Search term
     * @returns Returns saved item
     */
    async setSearch(searchTerm: string): Promise<InsertOneResult<Document>>{
        //Connect to the SearchCount collection
        const collection = (await this.connectDB()).collection(this.#searchCountCollection);
        const result = await collection.insertOne({searchTerm, time: +new Date()});
        this.#monClient.close();

        return result;
    }
    /**
     * Gets the total number of search performed
     * @returns Returns the total search saved
     */
    async getTotalSearchCount(): Promise<number> {
        //Connect to the SearchCount collection
        const collection = (await this.connectDB()).collection(this.#searchCountCollection);
        const totalSearch = await collection.countDocuments();
        this.#monClient.close();
        return totalSearch;
    }

}

module.exports = DB;