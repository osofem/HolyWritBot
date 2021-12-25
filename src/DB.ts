import * as db from "m3o/db";

export default class DB{
    apiKey: string; dbService;
    #usersTable = process.env.usersTable;//?process.env.usersTable:"devHolyWritUsers";
    #versesCountTable = process.env.versesCountTable;
    #readoutCountTable = process.env.readoutCountTable;
    #searchCountTable = process.env.searchCountTable;

    /**
     * Constructor for the M3O DB service
     * @param key M3O service API key
     */
    constructor(key: string){
        this.apiKey = key;
        this.dbService = new db.DbService(this.apiKey);
    }


    /***+++++++++++++++++++++
        USER
    ++++++++++++++++++++++++***/

    /**
     * Create record of a user in the database
     * @param userID ID of the user
     * @returns Returns the record created
     */
    async createUser(userID: string){
        //Create the create request
        let record = {
            id: userID,
            firstAccess: +new Date(),
            lastAccess: +new Date(),
            edition: 'kjv'
        };

        return await this.dbService.create({record, table: this.#usersTable});
    }

    /**
     * Retrive a user from the database
     * @param userID ID of the user
     * @returns Returns a record of the user from the database
     */
    async getUser(userID: string): Promise<db.ReadResponse>{
        //Create the read request
        let record: db.ReadRequest = {
            query: "id == \""+userID+"\"",
            table: this.#usersTable
        };
        return await this.dbService.read(record);
    }

    /**
     * Updates a user infomation in the database
     * @param userID ID of the user
     * @returns Returns a record of the user from the database
     */
     async updateUser(userID: string, content: any): Promise<db.UpdateResponse>{
        //Create the read request
        let record: db.UpdateRequest = {
            id: userID,
            ...content
        };
        return await this.dbService.update({record, table: this.#usersTable});
    }

    /**
     * Gets the total number of users for the bot
     * @returns Returns the total bot user
     */
    async getTotalUsers(): Promise<db.CountResponse>{
        return this.dbService.count({table: this.#usersTable});
    }

    /**
     * Change the bible edition for a user
     * @param userID User ID
     * @param edition Edition to change to
     * @returns Returns the chnaged user data
     */
    async changeEdition(userID: string, edition: string){
        //Create the read request
        let record = {
            id: userID,
            edition
        };
        return await this.dbService.update({record, table: this.#usersTable});
    }

    /**
     * Get the edition for the user
     * @param userID ID of the user
     * @returns Returns the current edition the user selected
     */
    async getCurrentEdition(userID: string): Promise<string>{
        //Create the read request
        let record: db.ReadRequest = {
            query: "id == \""+userID+"\"",
            table: this.#usersTable
        };
    
        let result = await this.dbService.read(record);

        if(result["records"])
            return result["records"][0].edition!=undefined?result["records"][0].edition:'kjv';
        else
            return "kjv";
    }

    /***+++++++++++++++++++++
        VERSE COUNT
    ++++++++++++++++++++++++***/

    /**
     * Save the verse request to database
     * @param verse Verse requested
     * @returns Returns the total verse count
     */
    async setVerse(verse: string){
        //Create the create request
        let record = {
            verse,
            time: +new Date()
        };

        return await this.dbService.create({record, table: this.#versesCountTable});
    }

    async getTotalVerseCount(){
        return this.dbService.count({table: this.#versesCountTable});
    }

    /***+++++++++++++++++++++
        READOUT COUNT
    ++++++++++++++++++++++++***/

    /**
     * Save the readout requests to database
     * @param verse Verse to readout
     * @returns Returns the saved item
     */
    async setReadout(verse: string){
        //Create the create request
        let record = {
            verse,
            time: +new Date()
        };

        return await this.dbService.create({record, table: this.#readoutCountTable});
    }

    /**
     * @returns Returns the total readout count
     */
    async getTotalReadoutCount(){
        return this.dbService.count({table: this.#readoutCountTable});
    }

    /***+++++++++++++++++++++
        SEARCH COUNT
    ++++++++++++++++++++++++***/

    /**
     * Save the search term to database
     * @param searchTerm Search term
     * @returns Returns saved item
     */
    async setSearch(searchTerm: string){
        //Create the create request
        let record = {
            searchTerm,
            time: +new Date()
        };

        return await this.dbService.create({record, table: this.#searchCountTable});
    }
    /**
     * @returns Returns the total search saved
     */
    async getTotalSearchCount(){
        return this.dbService.count({table: this.#searchCountTable});
    }

}

module.exports = DB;