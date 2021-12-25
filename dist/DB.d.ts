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
    /**
     * Change the bible edition for a user
     * @param userID User ID
     * @param edition Edition to change to
     * @returns Returns the chnaged user data
     */
    changeEdition(userID: string, edition: string): Promise<db.UpdateResponse>;
    /**
     * Change the readout voice
     * @param userID User ID
     * @param voiceID ID of voice to change to
     * @returns Returns the chnaged user data
     */
    changeVoiceReadout(userID: string, voiceID: string): Promise<db.UpdateResponse>;
    /**
     * Get the edition for the user
     * @param userID ID of the user
     * @returns Returns the current edition the user selected
     */
    getCurrentEdition(userID: string): Promise<string>;
    /**
     * Get the current voice ID
     * @param userID ID of the user
     * @returns Returns the current voice ID the user selected
     */
    getCurrentVoiceID(userID: string): Promise<string>;
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
