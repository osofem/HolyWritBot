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
var _DB_monClient, _DB_dbName, _DB_usersCollection, _DB_versesCountCollection, _DB_readoutCountCollection, _DB_searchCountCollection;
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class DB {
    /**
     * Constructor for the MongoDB service
     * @param conString MongoDBconnection string
     */
    constructor(conString) {
        _DB_monClient.set(this, void 0);
        _DB_dbName.set(this, process.env.dbName ? process.env.dbName : "xnHolyWrit");
        _DB_usersCollection.set(this, process.env.usersTable ? process.env.usersTable : "xnUsers");
        _DB_versesCountCollection.set(this, process.env.versesCountTable ? process.env.versesCountTable : "xnVerseCount");
        _DB_readoutCountCollection.set(this, process.env.readoutCountTable ? process.env.readoutCountTable : "xnReadoutCount");
        _DB_searchCountCollection.set(this, process.env.searchCountTable ? process.env.searchCountTable : "xnSearchCount");
        __classPrivateFieldSet(this, _DB_monClient, new mongodb_1.MongoClient(conString), "f");
    }
    /**
     * Connect to the database
     */
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _DB_monClient, "f").connect();
            return __classPrivateFieldGet(this, _DB_monClient, "f").db(__classPrivateFieldGet(this, _DB_dbName, "f"));
        });
    }
    /***+++++++++++++++++++++
        USER
    ++++++++++++++++++++++++***/
    /**
     * Create document of a user in the collection
     * @param userID ID of the user
     * @returns Returns the record created
     */
    createUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the user collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_usersCollection, "f"));
            //Create the document
            let record = {
                userID,
                firstAccess: +new Date(),
                lastAccess: +new Date(),
                edition: 'kjv',
                voiceID: "ID1"
            };
            //Save new user and close the connection
            const newUser = yield collection.insertOne(record);
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return newUser;
        });
    }
    /**
     * Retrive a user from the users collection
     * @param userID ID of the user
     * @returns Returns a document of the user from the collection
     */
    getUser(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the user collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_usersCollection, "f"));
            //Create the read request
            let filter = {
                userID
            };
            //Retrieve the user and close the connection
            const user = yield collection.findOne(filter);
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return user;
        });
    }
    /**
     * Updates a user infomation in the collection
     * @param userID ID of the user
     * @param content contents to update
     * @returns Returns a document of the updated user
     */
    updateUser(userID, content) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the user collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_usersCollection, "f"));
            const updatedUser = yield collection.updateOne({ userID }, { $set: Object.assign({}, content) }, { upsert: true });
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return updatedUser;
        });
    }
    /**
     * Gets the total number of users for the bot
     * @returns Returns the total bot users
     */
    getTotalUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the user collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_usersCollection, "f"));
            const totalUsers = yield collection.countDocuments();
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return totalUsers;
        });
    }
    /**
     * Change the bible edition for a user
     * @param userID User ID
     * @param edition Edition to change to
     * @returns Returns the updated user
     */
    changeEdition(userID, edition) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the user collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_usersCollection, "f"));
            const updatedUser = yield collection.updateOne({ userID }, { $set: { edition } }, { upsert: true });
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return updatedUser;
        });
    }
    /**
     * Change the readout voice
     * @param userID User ID
     * @param voiceID ID of voice to change to
     * @returns Returns the updated user
     */
    changeVoiceReadout(userID, voiceID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the user collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_usersCollection, "f"));
            const updatedUser = yield collection.updateOne({ userID }, { $set: { voiceID } }, { upsert: true });
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return updatedUser;
        });
    }
    /**
     * Get the edition for the user
     * @param userID ID of the user
     * @returns Returns the current edition the selected user
     */
    getCurrentEdition(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the user collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_usersCollection, "f"));
            const user = yield collection.findOne({ userID });
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            if (user != null)
                return user['edition'] != undefined ? user['edition'] : 'kjv';
            else
                return "kjv";
        });
    }
    /**
     * Get the current voice ID
     * @param userID ID of the user
     * @returns Returns the current voice ID the selected user
     */
    getCurrentVoiceID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the user collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_usersCollection, "f"));
            const user = yield collection.findOne({ userID });
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            if (user != null)
                return user['voiceID'] != undefined ? user['voiceID'] : 'ID1';
            else
                return "ID1";
        });
    }
    /***+++++++++++++++++++++
        VERSE COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the verse request to collection
     * @param verse Verse requested
     * @returns Returns inserted document
     */
    setVerse(verse) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the verseCount collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_versesCountCollection, "f"));
            const result = yield collection.insertOne({ verse, time: +new Date() });
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return result;
        });
    }
    /**
     * Get total verses searched
     * @returns Returns total number of verses searched
     */
    getTotalVerseCount() {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the verseCount collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_versesCountCollection, "f"));
            const totalVerses = yield collection.countDocuments();
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return totalVerses;
        });
    }
    /***+++++++++++++++++++++
        READOUT COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the readout requests to the collection
     * @param verse Verse to readout
     * @returns Returns the saved document
     */
    setReadout(verse) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the readoutCount collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_readoutCountCollection, "f"));
            const result = yield collection.insertOne({ verse, time: +new Date() });
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return result;
        });
    }
    /**
     * Gets the total readouts requested
     * @returns Returns the total readout count
     */
    getTotalReadoutCount() {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the readoutCount collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_readoutCountCollection, "f"));
            const totalReadout = yield collection.countDocuments();
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return totalReadout;
        });
    }
    /***+++++++++++++++++++++
        SEARCH COUNT
    ++++++++++++++++++++++++***/
    /**
     * Save the search term to the collection
     * @param searchTerm Search term
     * @returns Returns saved item
     */
    setSearch(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the SearchCount collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_searchCountCollection, "f"));
            const result = yield collection.insertOne({ searchTerm, time: +new Date() });
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return result;
        });
    }
    /**
     * Gets the total number of search performed
     * @returns Returns the total search saved
     */
    getTotalSearchCount() {
        return __awaiter(this, void 0, void 0, function* () {
            //Connect to the SearchCount collection
            const collection = (yield this.connectDB()).collection(__classPrivateFieldGet(this, _DB_searchCountCollection, "f"));
            const totalSearch = yield collection.countDocuments();
            __classPrivateFieldGet(this, _DB_monClient, "f").close();
            return totalSearch;
        });
    }
}
exports.default = DB;
_DB_monClient = new WeakMap(), _DB_dbName = new WeakMap(), _DB_usersCollection = new WeakMap(), _DB_versesCountCollection = new WeakMap(), _DB_readoutCountCollection = new WeakMap(), _DB_searchCountCollection = new WeakMap();
module.exports = DB;
