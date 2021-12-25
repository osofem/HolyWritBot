"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DB_usersTable, _DB_versesCountTable, _DB_readoutCountTable, _DB_searchCountTable;
Object.defineProperty(exports, "__esModule", { value: true });
const db = __importStar(require("m3o/db"));
class DB {
    /**
     * Constructor for the M3O DB service
     * @param key M3O service API key
     */
    constructor(key) {
        _DB_usersTable.set(this, process.env.usersTable); //?process.env.usersTable:"devHolyWritUsers";
        _DB_versesCountTable.set(this, process.env.versesCountTable);
        _DB_readoutCountTable.set(this, process.env.readoutCountTable);
        _DB_searchCountTable.set(this, process.env.searchCountTable);
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
    createUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Create the create request
            let record = {
                id: userID,
                firstAccess: +new Date(),
                lastAccess: +new Date(),
                edition: 'kjv',
                voiceID: "ID1"
            };
            return yield this.dbService.create({ record, table: __classPrivateFieldGet(this, _DB_usersTable, "f") });
        });
    }
    /**
     * Retrive a user from the database
     * @param userID ID of the user
     * @returns Returns a record of the user from the database
     */
    getUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Create the read request
            let record = {
                query: "id == \"" + userID + "\"",
                table: __classPrivateFieldGet(this, _DB_usersTable, "f")
            };
            return yield this.dbService.read(record);
        });
    }
    /**
     * Updates a user infomation in the database
     * @param userID ID of the user
     * @returns Returns a record of the user from the database
     */
    updateUser(userID, content) {
        return __awaiter(this, void 0, void 0, function* () {
            //Create the read request
            let record = Object.assign({ id: userID }, content);
            return yield this.dbService.update({ record, table: __classPrivateFieldGet(this, _DB_usersTable, "f") });
        });
    }
    /**
     * Gets the total number of users for the bot
     * @returns Returns the total bot user
     */
    getTotalUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dbService.count({ table: __classPrivateFieldGet(this, _DB_usersTable, "f") });
        });
    }
    /**
     * Change the bible edition for a user
     * @param userID User ID
     * @param edition Edition to change to
     * @returns Returns the chnaged user data
     */
    changeEdition(userID, edition) {
        return __awaiter(this, void 0, void 0, function* () {
            //Create the read request
            let record = {
                id: userID,
                edition
            };
            return yield this.dbService.update({ record, table: __classPrivateFieldGet(this, _DB_usersTable, "f") });
        });
    }
    /**
     * Change the readout voice
     * @param userID User ID
     * @param voiceID ID of voice to change to
     * @returns Returns the chnaged user data
     */
    changeVoiceReadout(userID, voiceID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Create the read request
            let record = {
                id: userID,
                voiceID
            };
            return yield this.dbService.update({ record, table: __classPrivateFieldGet(this, _DB_usersTable, "f") });
        });
    }
    /**
     * Get the edition for the user
     * @param userID ID of the user
     * @returns Returns the current edition the user selected
     */
    getCurrentEdition(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Create the read request
            let record = {
                query: "id == \"" + userID + "\"",
                table: __classPrivateFieldGet(this, _DB_usersTable, "f")
            };
            let result = yield this.dbService.read(record);
            if (result["records"])
                return result["records"][0].edition != undefined ? result["records"][0].edition : 'kjv';
            else
                return "kjv";
        });
    }
    /**
     * Get the current voice ID
     * @param userID ID of the user
     * @returns Returns the current voice ID the user selected
     */
    getCurrentVoiceID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Create the read request
            let record = {
                query: "id == \"" + userID + "\"",
                table: __classPrivateFieldGet(this, _DB_usersTable, "f")
            };
            let result = yield this.dbService.read(record);
            if (result["records"])
                return result["records"][0].voiceID != undefined ? result["records"][0].voiceID : 'ID1';
            else
                return "ID1";
        });
    }
    /***+++++++++++++++++++++
        VERSE COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the verse request to database
     * @param verse Verse requested
     * @returns Returns the total verse count
     */
    setVerse(verse) {
        return __awaiter(this, void 0, void 0, function* () {
            //Create the create request
            let record = {
                verse,
                time: +new Date()
            };
            return yield this.dbService.create({ record, table: __classPrivateFieldGet(this, _DB_versesCountTable, "f") });
        });
    }
    getTotalVerseCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dbService.count({ table: __classPrivateFieldGet(this, _DB_versesCountTable, "f") });
        });
    }
    /***+++++++++++++++++++++
        READOUT COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the readout requests to database
     * @param verse Verse to readout
     * @returns Returns the saved item
     */
    setReadout(verse) {
        return __awaiter(this, void 0, void 0, function* () {
            //Create the create request
            let record = {
                verse,
                time: +new Date()
            };
            return yield this.dbService.create({ record, table: __classPrivateFieldGet(this, _DB_readoutCountTable, "f") });
        });
    }
    /**
     * @returns Returns the total readout count
     */
    getTotalReadoutCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dbService.count({ table: __classPrivateFieldGet(this, _DB_readoutCountTable, "f") });
        });
    }
    /***+++++++++++++++++++++
        SEARCH COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the search term to database
     * @param searchTerm Search term
     * @returns Returns saved item
     */
    setSearch(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            //Create the create request
            let record = {
                searchTerm,
                time: +new Date()
            };
            return yield this.dbService.create({ record, table: __classPrivateFieldGet(this, _DB_searchCountTable, "f") });
        });
    }
    /**
     * @returns Returns the total search saved
     */
    getTotalSearchCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dbService.count({ table: __classPrivateFieldGet(this, _DB_searchCountTable, "f") });
        });
    }
}
exports.default = DB;
_DB_usersTable = new WeakMap(), _DB_versesCountTable = new WeakMap(), _DB_readoutCountTable = new WeakMap(), _DB_searchCountTable = new WeakMap();
module.exports = DB;
