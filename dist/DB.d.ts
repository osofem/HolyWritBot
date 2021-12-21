import * as db from "m3o/db";
export default class DB {
    #private;
    apiKey: string;
    dbService: db.DbService;
    /**
     * Constructor for the M3O DB service
     * @param key M3O service API key
     */
    constructor(key: string);
    /***+++++++++++++++++++++
        USER
    ++++++++++++++++++++++++***/
    /**
     * Create record of a user in the database
     * @param userID ID of the user
     * @returns Returns the record created
     */
    createUser(userID: string): Promise<db.CreateResponse>;
    /**
     * Retrive a user from the database
     * @param userID ID of the user
     * @returns Returns a record of the user from the database
     */
    getUser(userID: string): Promise<db.ReadResponse>;
    /**
     * Updates a user infomation in the database
     * @param userID ID of the user
     * @returns Returns a record of the user from the database
     */
    updateUser(userID: string, content: any): Promise<db.UpdateResponse>;
    /**
     * Gets the total number of users for the bot
     * @returns Returns the total bot user
     */
    getTotalUsers(): Promise<db.CountResponse>;
    /***+++++++++++++++++++++
        VERSE COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the verse request to database
     * @param verse Verse requested
     * @returns Returns the total verse count
     */
    setVerse(verse: string): Promise<db.CreateResponse>;
    getTotalVerseCount(): Promise<db.CountResponse>;
    /***+++++++++++++++++++++
        READOUT COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the readout requests to database
     * @param verse Verse to readout
     * @returns Returns the saved item
     */
    setReadout(verse: string): Promise<db.CreateResponse>;
    /**
     * @returns Returns the total readout count
     */
    getTotalReadoutCount(): Promise<db.CountResponse>;
    /***+++++++++++++++++++++
        SEARCH COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the search term to database
     * @param searchTerm Search term
     * @returns Returns saved item
     */
    setSearch(searchTerm: string): Promise<db.CreateResponse>;
    /**
     * @returns Returns the total search saved
     */
    getTotalSearchCount(): Promise<db.CountResponse>;
}
