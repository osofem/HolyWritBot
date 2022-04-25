import { InsertOneResult, UpdateResult, WithId } from 'mongodb';
export default class DB {
    #private;
    /**
     * Constructor for the MongoDB service
     * @param conString MongoDBconnection string
     */
    constructor(conString: string);
    /**
     * Connect to the database
     */
    connectDB(): Promise<import("mongodb").Db>;
    /***+++++++++++++++++++++
        USER
    ++++++++++++++++++++++++***/
    /**
     * Create document of a user in the collection
     * @param userID ID of the user
     * @returns Returns the record created
     */
    createUser(userID: string): Promise<InsertOneResult<Document>>;
    /**
     * Retrive a user from the users collection
     * @param userID ID of the user
     * @returns Returns a document of the user from the collection
     */
    getUser(userID: string): Promise<WithId<import("bson").Document> | null>;
    /**
     * Updates a user infomation in the collection
     * @param userID ID of the user
     * @param content contents to update
     * @returns Returns a document of the updated user
     */
    updateUser(userID: string, content: any): Promise<UpdateResult>;
    /**
     * Gets the total number of users for the bot
     * @returns Returns the total bot users
     */
    getTotalUsers(): Promise<number>;
    /**
     * Change the bible edition for a user
     * @param userID User ID
     * @param edition Edition to change to
     * @returns Returns the updated user
     */
    changeEdition(userID: string, edition: string): Promise<UpdateResult>;
    /**
     * Change the readout voice
     * @param userID User ID
     * @param voiceID ID of voice to change to
     * @returns Returns the updated user
     */
    changeVoiceReadout(userID: string, voiceID: string): Promise<UpdateResult>;
    /**
     * Get the edition for the user
     * @param userID ID of the user
     * @returns Returns the current edition the selected user
     */
    getCurrentEdition(userID: string): Promise<string>;
    /**
     * Get the current voice ID
     * @param userID ID of the user
     * @returns Returns the current voice ID the selected user
     */
    getCurrentVoiceID(userID: string): Promise<string>;
    /***+++++++++++++++++++++
        VERSE COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the verse request to collection
     * @param verse Verse requested
     * @returns Returns inserted document
     */
    setVerse(verse: string): Promise<InsertOneResult<Document>>;
    /**
     * Get total verses searched
     * @returns Returns total number of verses searched
     */
    getTotalVerseCount(): Promise<number>;
    /***+++++++++++++++++++++
        READOUT COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the readout requests to the collection
     * @param verse Verse to readout
     * @returns Returns the saved document
     */
    setReadout(verse: string): Promise<InsertOneResult<Document>>;
    /**
     * Gets the total readouts requested
     * @returns Returns the total readout count
     */
    getTotalReadoutCount(): Promise<number>;
    /***+++++++++++++++++++++
        SEARCH COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the search term to the collection
     * @param searchTerm Search term
     * @returns Returns saved item
     */
    setSearch(searchTerm: string): Promise<InsertOneResult<Document>>;
    /**
     * Gets the total number of search performed
     * @returns Returns the total search saved
     */
    getTotalSearchCount(): Promise<number>;
}
