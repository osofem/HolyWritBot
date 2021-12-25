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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ProcessMessage_instances, _ProcessMessage_update, _ProcessMessage_bot, _ProcessMessage_os, _ProcessMessage_db, _ProcessMessage_m3oKey, _ProcessMessage_userID, _ProcessMessage_maxKeyBoardHeight, _ProcessMessage_maxKeyBoardWidth, _ProcessMessage_maxSearchResultLength, _ProcessMessage_bible, _ProcessMessage_changeVersion, _ProcessMessage_changeReadout, _ProcessMessage_donate, _ProcessMessage_removeKeyboard, _ProcessMessage_processMessage, _ProcessMessage_searchResultFormating, _ProcessMessage_processInlineQuery, _ProcessMessage_processCallbackQuery, _ProcessMessage_updateOrRegisterUser, _ProcessMessage_getVerseKeyboard, _ProcessMessage_getChapterKeyboard, _ProcessMessage_oldTestamentKeyboard, _ProcessMessage_newTestamentKeyboard;
Object.defineProperty(exports, "__esModule", { value: true });
const bible_1 = __importDefault(require("./bible"));
const holyPolly_1 = __importDefault(require("./holyPolly"));
const holySearch_1 = __importDefault(require("./holySearch"));
const DB_1 = __importDefault(require("./DB"));
class ProcessMessage {
    constructor(update, content) {
        _ProcessMessage_instances.add(this);
        _ProcessMessage_update.set(this, void 0);
        _ProcessMessage_bot.set(this, void 0);
        _ProcessMessage_os.set(this, require("os"));
        _ProcessMessage_db.set(this, void 0);
        _ProcessMessage_m3oKey.set(this, void 0);
        _ProcessMessage_userID.set(this, void 0);
        _ProcessMessage_maxKeyBoardHeight.set(this, 5);
        _ProcessMessage_maxKeyBoardWidth.set(this, 5);
        _ProcessMessage_maxSearchResultLength.set(this, 10);
        _ProcessMessage_bible.set(this, void 0);
        _ProcessMessage_changeVersion.set(this, "🏷 Change Bible Edition");
        _ProcessMessage_changeReadout.set(this, "🗣 Change Read Out Voice");
        _ProcessMessage_donate.set(this, "💳 Donate");
        _ProcessMessage_removeKeyboard.set(this, "🚫 Remove this keyboard");
        __classPrivateFieldSet(this, _ProcessMessage_update, JSON.parse(update), "f");
        __classPrivateFieldSet(this, _ProcessMessage_bot, content.bot, "f");
        __classPrivateFieldSet(this, _ProcessMessage_m3oKey, content.m3oKey, "f");
        //get userID
        __classPrivateFieldSet(this, _ProcessMessage_userID, "", "f");
        if (typeof __classPrivateFieldGet(this, _ProcessMessage_update, "f")['message'] !== 'undefined') {
            __classPrivateFieldSet(this, _ProcessMessage_userID, __classPrivateFieldGet(this, _ProcessMessage_update, "f")['message']['chat']['id'], "f");
        }
        else if (typeof __classPrivateFieldGet(this, _ProcessMessage_update, "f")['inline_query'] !== 'undefined') {
            __classPrivateFieldSet(this, _ProcessMessage_userID, __classPrivateFieldGet(this, _ProcessMessage_update, "f")['inline_query']['from']['id'], "f");
        }
        else if (typeof __classPrivateFieldGet(this, _ProcessMessage_update, "f")['callback_query'] !== 'undefined') {
            __classPrivateFieldSet(this, _ProcessMessage_userID, __classPrivateFieldGet(this, _ProcessMessage_update, "f")['callback_query']['from']['id'], "f");
        }
        __classPrivateFieldSet(this, _ProcessMessage_bible, new bible_1.default({ m3oKey: content.m3oKey, userID: __classPrivateFieldGet(this, _ProcessMessage_userID, "f") }), "f");
        __classPrivateFieldSet(this, _ProcessMessage_db, new DB_1.default(content.m3oKey), "f");
    }
    /**
     * Execute the current update
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            //Load bible properly
            yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").execute();
            let update = __classPrivateFieldGet(this, _ProcessMessage_update, "f");
            //message //////////////////////
            if (typeof update['message'] !== 'undefined') {
                let content = { chatID: update['message']['chat']['id'], text: update['message']['text'] };
                content.date = update['message']['date'];
                content.type = update['message']['chat']['type'];
                content.messageID = update['message']['message_id'];
                yield __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_processMessage).call(this, content);
            }
            //inline query //////////////////////
            if (typeof update['inline_query'] !== 'undefined') {
                let content = { chatID: update['inline_query']['from']['id'] };
                content.queryID = update['inline_query']['id'];
                content.queryData = update['inline_query']['query'];
                yield __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_processInlineQuery).call(this, content);
            }
            //callback query //////////////////////
            if (typeof update['callback_query'] !== 'undefined') {
                let content = { chatID: update['callback_query']['from']['id'] };
                content.queryID = update['callback_query']['id'];
                content.queryData = update['callback_query']['data'];
                content.messageID = update['callback_query']['message']['message_id'];
                yield __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_processCallbackQuery).call(this, content);
            }
        });
    }
}
exports.default = ProcessMessage;
_ProcessMessage_update = new WeakMap(), _ProcessMessage_bot = new WeakMap(), _ProcessMessage_os = new WeakMap(), _ProcessMessage_db = new WeakMap(), _ProcessMessage_m3oKey = new WeakMap(), _ProcessMessage_userID = new WeakMap(), _ProcessMessage_maxKeyBoardHeight = new WeakMap(), _ProcessMessage_maxKeyBoardWidth = new WeakMap(), _ProcessMessage_maxSearchResultLength = new WeakMap(), _ProcessMessage_bible = new WeakMap(), _ProcessMessage_changeVersion = new WeakMap(), _ProcessMessage_changeReadout = new WeakMap(), _ProcessMessage_donate = new WeakMap(), _ProcessMessage_removeKeyboard = new WeakMap(), _ProcessMessage_instances = new WeakSet(), _ProcessMessage_processMessage = function _ProcessMessage_processMessage(content) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (content.text == "/start") {
            let firstName = JSON.parse(yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").getChat(content.chatID))['result']['first_name'];
            //send texting status
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendChatAction({ chat_id: content.chatID, action: 'typing' });
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: "Hello " + firstName + "! I am the Holy Writ bot, your one-stop bot for your bible straight with Telegram." + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL +
                    "To use me, simply send the bible verse in the format <code>book chapter:verse</code> or <code>book chapter verse</code> (e.g. <b><i>1 John 2:5</i></b> or <b><i>1 John 2 5</i></b>). Or better still, use the bot commands!" + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL +
                    "To search, type your search term prefixed by /s into the bot <code>/s your search</code> (e.g. <b><i>/s Jesus said</i></b>)" + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL +
                    "To tweak your settings, use /settings" + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL +
                    `<b>Channel:</b> @HolyWritDiscuss`,
                parse_mode: "HTML"
            });
        }
        else if (content.text == "/s") {
            //send texting status
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendChatAction({ chat_id: content.chatID, action: 'typing' });
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: "To search, type your search term prefixed by /s into the bot <code>/s your search</code> (e.g. <b><i>/s Jesus said</i></b>)",
                parse_mode: "HTML"
            });
        }
        else if (content.text == "/oldtestament") {
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_oldTestamentKeyboard).call(this);
            //send texting status
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendChatAction({ chat_id: content.chatID, action: 'typing' });
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: "Old Testament ⬇️",
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        else if (content.text == "/newtestament") {
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_newTestamentKeyboard).call(this);
            //send texting status
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendChatAction({ chat_id: content.chatID, action: 'typing' });
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: "New Testament ⬇️",
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        else if (content.text == "/stat") {
            let usersCount = yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").getTotalUsers();
            let verseCount = yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").getTotalVerseCount();
            let readoutCount = yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").getTotalReadoutCount();
            let searchCount = yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").getTotalSearchCount();
            let stat = "📊 <b>Bot Statistics</b>" + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL;
            stat += `<b>Users:</b> <i>${usersCount.count} users ${__classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL}</i>`;
            stat += `<b>Verses:</b> <i>${verseCount.count} verses served ${__classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL}</i>`;
            stat += `<b>Read Out:</b> <i>${readoutCount.count} readouts served ${__classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL}</i>`;
            stat += `<b>Searches:</b> <i>${searchCount.count} searches served ${__classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL}${__classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL}</i>`;
            stat += `<b>Channel:</b> @HolyWritDiscuss`;
            //send texting status
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendChatAction({ chat_id: content.chatID, action: 'typing' });
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: stat,
                parse_mode: "HTML"
            });
        }
        //Search
        else if (((_a = content.text) === null || _a === void 0 ? void 0 : _a.substr(0, 3)) == "/s ") {
            let searchTerm = (_b = content.text) === null || _b === void 0 ? void 0 : _b.substr(2).trim();
            const holySearch = new holySearch_1.default({ m3oKey: __classPrivateFieldGet(this, _ProcessMessage_m3oKey, "f"), userID: content.chatID + "" });
            let searchResults = yield holySearch.search(searchTerm);
            let lengthToReturn = Math.min(searchResults.length, __classPrivateFieldGet(this, _ProcessMessage_maxSearchResultLength, "f"));
            let nextIndex = lengthToReturn == searchResults.length ? 0 : lengthToReturn;
            //keyboard
            let inline_keyboard = [];
            inline_keyboard.push([
                { text: "⏮", callback_data: `prevSearch: 0 ${searchTerm}` },
                { text: "⏭", callback_data: `nextSearch: ${nextIndex} ${searchTerm}` }
            ]);
            let keyboard = { inline_keyboard };
            //send texting status
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendChatAction({ chat_id: content.chatID, action: 'typing' });
            //Save search request
            yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").setSearch(searchTerm);
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: `<b>${searchTerm}</b>` + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + (yield __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_searchResultFormating).call(this, searchResults, 0, lengthToReturn)),
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //settings
        else if (content.text == "/settings") {
            let keyboard = [];
            keyboard.push([{ text: __classPrivateFieldGet(this, _ProcessMessage_changeVersion, "f") }]);
            keyboard.push([{ text: __classPrivateFieldGet(this, _ProcessMessage_changeReadout, "f") }]);
            keyboard.push([{ text: __classPrivateFieldGet(this, _ProcessMessage_donate, "f") }]);
            keyboard.push([{ text: __classPrivateFieldGet(this, _ProcessMessage_removeKeyboard, "f") }]);
            let keyboardv = { keyboard, one_time_keyboard: true, resize_keyboard: true, input_field_placeholder: "Please select a setting" };
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: `Please select a setting`,
                parse_mode: "HTML",
                reply_markup: keyboardv
            });
        }
        else if (content.text == __classPrivateFieldGet(this, _ProcessMessage_changeVersion, "f")) {
            let inline_keyboard = [];
            const versions = require("../dataset/editions.json");
            let keys = Object.keys(versions);
            for (let key in keys) {
                inline_keyboard.push([{ text: `${versions[keys[key]]} (${keys[key]})`, callback_data: `bEdition: ${keys[key]}` }]);
            }
            let keyboard = { inline_keyboard };
            let edition = yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").getCurrentEdition(content.chatID + "");
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: `Your bible edition is currently <b>${versions[edition]}: (${edition.toUpperCase()})</b>, please select the edition you want to switch to below!`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        else if (content.text == __classPrivateFieldGet(this, _ProcessMessage_changeReadout, "f")) {
            let inline_keyboard = [];
            const voices = require("../dataset/readoutVoice.json");
            let keys = Object.keys(voices);
            for (let key in keys) {
                inline_keyboard.push([{ text: `${voices[keys[key]]['gender'].toUpperCase()} (${voices[keys[key]]['age'].toUpperCase()})`, callback_data: `cVoices: ${keys[key]}` }]);
            }
            let keyboard = { inline_keyboard };
            let currentID = yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").getCurrentVoiceID(content.chatID + '');
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: `Your voice readout is currently <b> ${voices[currentID].gender.toUpperCase()} (${voices[currentID].age.toUpperCase()}):</b>, please select the voice you want to switch to below!`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        else if (content.text == __classPrivateFieldGet(this, _ProcessMessage_donate, "f")) {
            let inline_keyboard = [];
            inline_keyboard.push([
                { text: "💳 Donate", url: process.env.donateURL }
            ]);
            let keyboard = { inline_keyboard };
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: "Thank you for your donations, all donations will go towards server fees and developers stipends.",
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        else if (content.text == __classPrivateFieldGet(this, _ProcessMessage_removeKeyboard, "f")) {
            let remove_keyboard = true;
            let keyboard = { remove_keyboard };
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                chat_id: content.chatID,
                text: "Settings keyboard removed successfully!",
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        else {
            if (content.text) {
                let v = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").verse(content.text.toLowerCase());
                if (v == undefined) {
                    yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                        chat_id: content.chatID,
                        text: "I could not find the verse you are looking for. Please ensure your spellings are correct and in the format <code>book chapter:verse</code> (e.g. <i>1 John 2:5</i>). Or better still, use the bot commands!",
                        parse_mode: "HTML"
                    });
                }
                else if (typeof v.encodedVerse != "undefined") {
                    //Save verse request
                    yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").setVerse(content.text.toLowerCase());
                    yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendMessage({
                        chat_id: content.chatID,
                        text: v.encodedVerse,
                        parse_mode: "HTML",
                        reply_markup: v.keyboard
                    });
                }
            }
        }
        //Update or register user
        yield __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_updateOrRegisterUser).call(this, content.chatID.toString());
    });
}, _ProcessMessage_searchResultFormating = function _ProcessMessage_searchResultFormating(searchResults, start, length) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = `<i>${searchResults.length} result(s) from the ${__classPrivateFieldGet(this, _ProcessMessage_bible, "f").edition.toUpperCase()} edition</i>${__classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL}`;
        let i = start < 0 ? 0 : start > searchResults.length ? 0 : start;
        length = length > (searchResults.length - start) ? searchResults.length - start : length;
        for (; i < length + start; i++) {
            let r = searchResults[i];
            result += `${i + 1}. <b>${r['book']} ${r['chapter']}:${r['verse']} - </b> <i>${r['text']}</i> ${__classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL}`;
        }
        result += `<i>Result(s) ${start + 1} to ${i} of ${searchResults.length}</i>`;
        return result;
    });
}, _ProcessMessage_processInlineQuery = function _ProcessMessage_processInlineQuery(content) {
    return __awaiter(this, void 0, void 0, function* () {
        //Update or register user
        yield __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_updateOrRegisterUser).call(this, content.chatID.toString());
    });
}, _ProcessMessage_processCallbackQuery = function _ProcessMessage_processCallbackQuery(content) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = content.queryData ? content.queryData : "";
        //Previous verse e.g. 'prev: prv 18 23'
        if (query.substr(0, 5) == "prev:") {
            let bookAbbr = query.split(" ")[1];
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let chapter = +query.split(" ")[2];
            let verse = +query.split(" ")[3];
            let v = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").verse(`${book} ${chapter}:${verse}`);
            if (v.encodedVerse != undefined) {
                //Save verse request
                yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").setVerse(`${book} ${chapter}:${verse}`);
                yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                    chat_id: content.chatID,
                    message_id: content.messageID,
                    text: v.encodedVerse,
                    parse_mode: "HTML",
                    reply_markup: v.keyboard
                });
            }
        }
        //Next verse e.g. 'next: jl 2 19'
        if (query.substr(0, 5) == "next:") {
            let bookAbbr = query.split(" ")[1];
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let chapter = +query.split(" ")[2];
            let verse = +query.split(" ")[3];
            let v = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").verse(`${book} ${chapter}:${verse}`);
            if (v.encodedVerse != undefined) {
                //Save verse request
                yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").setVerse(`${book} ${chapter}:${verse}`);
                yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                    chat_id: content.chatID,
                    message_id: content.messageID,
                    text: v.encodedVerse,
                    parse_mode: "HTML",
                    reply_markup: v.keyboard
                });
            }
        }
        //Old Testament Chapters
        //Select old testament book (e.g. 'ot: prv')
        //Back to a book in the old testament (e.g. 'bbot: prv' back to proverbs chapters selection)
        if (query.substr(0, 3) == "ot:" || query.substr(0, 5) == "bbot:") {
            let bookAbbr = query.split(" ")[1];
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let chapterCounter = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").getChapterCount(book);
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_getChapterKeyboard).call(this, bookAbbr, chapterCounter, "xot");
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book}</b>: now choose the chapter ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //Back to Old Testament
        else if (query == "xot") {
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_oldTestamentKeyboard).call(this);
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: "Old Testament ⬇️",
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //forward the chapter selection: e.g. 'fxot: ps 25' (psalms from chapter 26 upwards)
        else if (query.substr(0, 5) == "fxot:") {
            let bookAbbr = query.split(" ")[1];
            let start = +query.split(" ")[2];
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let chapterCounter = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").getChapterCount(book);
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_getChapterKeyboard).call(this, bookAbbr, chapterCounter, "xot", start);
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book}</b>: now choose the chapter ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //back chapter selection: e.g. 'bxot: gn 25' (psalms from chapter 25 downwards)
        else if (query.substr(0, 5) == "bxot:") {
            let bookAbbr = query.split(" ")[1];
            let matrixCount = __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardHeight, "f") * __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardWidth, "f");
            let start = (+query.split(" ")[2] - matrixCount <= 0) ? 0 : (+query.split(" ")[2] - matrixCount);
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let chapterCounter = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").getChapterCount(book);
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_getChapterKeyboard).call(this, bookAbbr, chapterCounter, "xot", start);
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book}</b>: now choose the chapter ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //selected old testament chapter e.g. 'cot: ps 88' (psalms 88)
        else if (query.substr(0, 4) == "cot:") {
            let bookAbbr = query.split(" ")[1];
            let chapter = +query.split(" ")[2];
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let verseCounter = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").getVerseCount(book, chapter);
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_getVerseKeyboard).call(this, bookAbbr, chapter, verseCounter);
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book} ${chapter}</b>: now choose the verse ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //verse selected e.g. 'vcot: jl 3 13'
        else if (query.substr(0, 5) == "vcot:") {
            let bookAbbr = query.split(" ")[1];
            let chapter = +query.split(" ")[2];
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let verse = +query.split(" ")[3];
            let v = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").verse(`${book} ${chapter}:${verse}`);
            if (v.encodedVerse != undefined) {
                //Save verse request
                yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").setVerse(`${book} ${chapter}:${verse}`);
                yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                    chat_id: content.chatID,
                    message_id: content.messageID,
                    text: v.encodedVerse,
                    parse_mode: "HTML",
                    reply_markup: v.keyboard
                });
            }
        }
        //forward the verse selection: e.g. 'fxvot: prv 31 25' (proverbs chapter 31 from verse 26 upwards)
        else if (query.substr(0, 6) == "fxvot:") {
            let bookAbbr = query.split(" ")[1];
            let chapter = +query.split(" ")[2];
            let start = +query.split(" ")[3];
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let verseCounter = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").getVerseCount(book, chapter);
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_getVerseKeyboard).call(this, bookAbbr, chapter, verseCounter, start);
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book} ${chapter}</b>: now choose the verse ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //back the verse selection: e.g. 'bxvot: prv 31 25' (proverbs chapter 31 from verse 25 downwards)
        else if (query.substr(0, 6) == "bxvot:") {
            let bookAbbr = query.split(" ")[1];
            let chapter = +query.split(" ")[2];
            let matrixCount = __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardHeight, "f") * __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardWidth, "f");
            let start = (+query.split(" ")[3] - matrixCount <= 0) ? 0 : (+query.split(" ")[3] - matrixCount);
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let verseCounter = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").getVerseCount(book, chapter);
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_getVerseKeyboard).call(this, bookAbbr, chapter, verseCounter, start);
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book} ${chapter}</b>: now choose the verse ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //New Testament Chapters
        //Select old testament book (e.g. 'nt: lk')
        if (query.substr(0, 3) == "nt:") {
            let bookAbbr = query.split(" ")[1];
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let chapterCounter = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").getChapterCount(book);
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_getChapterKeyboard).call(this, bookAbbr, chapterCounter, "xnt");
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book}</b>: now choose the chapter ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //Back to New Testament
        else if (query == "xnt") {
            let keyboard = __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_newTestamentKeyboard).call(this);
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: "New Testament ⬇️",
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //Read out: Polly (e.g. 'ro: lk 1 2')
        if (query.substr(0, 3) == "ro:") {
            const holyPolly = new holyPolly_1.default(); //do NOT move to constructor, takes a lot of time to initialise
            let bookAbbr = query.split(" ")[1];
            let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
            let chapter = +query.split(" ")[2];
            let verse = +query.split(" ")[3];
            let text = yield __classPrivateFieldGet(this, _ProcessMessage_bible, "f").lookupForReadOut(book, chapter, verse);
            let currentVoiceID = yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").getCurrentVoiceID(content.chatID + '');
            let filename = yield holyPolly.speak(text, `${book} ${chapter}:${verse}`, currentVoiceID);
            //send texting status
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendChatAction({ chat_id: content.chatID, action: 'record_voice' });
            //Save readout request
            yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").setReadout(`${book} ${chapter}:${verse}`);
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").sendAudio({
                chat_id: content.chatID,
                audio: filename,
                caption: `${book} ${chapter}:${verse}` + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + "@HolyWritBot",
                parse_mode: "HTML",
                reply_to_message_id: content.messageID
            });
        }
        //Search results
        //nextSearch: ${lengthToReturn} ${searchTerm}
        if (query.substr(0, 11) == "nextSearch:") {
            let startIndex = +query.split(" ")[1];
            let searchTerm = query.substr(query.split(" ")[0].length + (startIndex + '').length + 1).trim();
            const holySearch = new holySearch_1.default({ m3oKey: __classPrivateFieldGet(this, _ProcessMessage_m3oKey, "f"), userID: content.chatID + "" });
            let searchResults = yield holySearch.search(searchTerm);
            let lengthToReturn = Math.min(searchResults.length - startIndex, __classPrivateFieldGet(this, _ProcessMessage_maxSearchResultLength, "f"));
            let nextIndex = startIndex + lengthToReturn >= searchResults.length ? startIndex : startIndex + lengthToReturn;
            //keyboard
            let inline_keyboard = [];
            inline_keyboard.push([
                { text: "⏮", callback_data: `prevSearch: ${startIndex} ${searchTerm}` },
                { text: "⏭", callback_data: `nextSearch: ${nextIndex} ${searchTerm}` }
            ]);
            let keyboard = { inline_keyboard };
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${searchTerm}</b>` + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + (yield __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_searchResultFormating).call(this, searchResults, startIndex, lengthToReturn)),
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //prevSearch: ${index} ${searchTerm}
        else if (query.substr(0, 11) == "prevSearch:") {
            let stopIndex = +query.split(" ")[1];
            let searchTerm = query.substr(query.split(" ")[0].length + (stopIndex + '').length + 1).trim();
            const holySearch = new holySearch_1.default({ m3oKey: __classPrivateFieldGet(this, _ProcessMessage_m3oKey, "f"), userID: content.chatID + "" });
            let searchResults = yield holySearch.search(searchTerm);
            stopIndex = stopIndex == 0 ? Math.min(searchResults.length, __classPrivateFieldGet(this, _ProcessMessage_maxSearchResultLength, "f")) : stopIndex;
            let startIndex = stopIndex - __classPrivateFieldGet(this, _ProcessMessage_maxSearchResultLength, "f");
            startIndex = startIndex < 0 ? 0 : startIndex;
            let lengthToReturn = Math.min(searchResults.length - startIndex, __classPrivateFieldGet(this, _ProcessMessage_maxSearchResultLength, "f"));
            //keyboard
            let inline_keyboard = [];
            inline_keyboard.push([
                { text: "⏮", callback_data: `prevSearch: ${startIndex} ${searchTerm}` },
                { text: "⏭", callback_data: `nextSearch: ${startIndex + lengthToReturn} ${searchTerm}` }
            ]);
            let keyboard = { inline_keyboard };
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${searchTerm}</b>` + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + __classPrivateFieldGet(this, _ProcessMessage_os, "f").EOL + (yield __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_searchResultFormating).call(this, searchResults, startIndex, lengthToReturn)),
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //Edition change
        if (query.substr(0, 9) == "bEdition:") {
            let edition = query.substr(9).trim();
            yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").changeEdition(content.chatID + "", edition);
            const versions = require("../dataset/editions.json");
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `Your bible edition successfully changed to: <b>${versions[edition]} (${edition.toUpperCase()})</b>`,
                parse_mode: "HTML"
            });
        }
        //change readout voice
        if (query.substr(0, 8) == "cVoices:") {
            let voiceID = query.substr(8).trim();
            yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").changeVoiceReadout(content.chatID + "", voiceID);
            const voices = require("../dataset/readoutVoice.json");
            yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `Your readout voice successfully changed to: <b>${voices[voiceID].gender.toUpperCase()} (${voices[voiceID].age.toUpperCase()})</b>`,
                parse_mode: "HTML"
            });
        }
        //Update or register user
        yield __classPrivateFieldGet(this, _ProcessMessage_instances, "m", _ProcessMessage_updateOrRegisterUser).call(this, content.chatID.toString());
        //Answer the query
        yield __classPrivateFieldGet(this, _ProcessMessage_bot, "f").answerCallbackQuery({
            callback_query_id: content.queryID ? content.queryID : "0",
            text: "Request Answered!"
        });
    });
}, _ProcessMessage_updateOrRegisterUser = function _ProcessMessage_updateOrRegisterUser(userID) {
    return __awaiter(this, void 0, void 0, function* () {
        //check if user exists
        let user = yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").getUser(userID);
        if (user.records && user.records.length > 0) {
            //user exist, update lastseen
            yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").updateUser(userID, {
                lastAccess: +new Date()
            });
        }
        else {
            //user does not exist, register user
            yield __classPrivateFieldGet(this, _ProcessMessage_db, "f").createUser(userID);
        }
    });
}, _ProcessMessage_getVerseKeyboard = function _ProcessMessage_getVerseKeyboard(bookAbbr, chapter, verseCount, start = 0) {
    let inline_keyboard = [];
    let colCount = 0, subKeyboard = [];
    let i = start;
    for (; i < verseCount; i++) {
        if (colCount < __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardWidth, "f")) {
            subKeyboard.push({ text: i + 1 + '', callback_data: `vcot: ${bookAbbr} ${chapter} ${i + 1}` });
            colCount++;
        }
        else {
            inline_keyboard.push(subKeyboard);
            subKeyboard = [];
            //check if max height for keyboard is attained
            if (inline_keyboard.length == __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardHeight, "f")) {
                break;
            }
            subKeyboard.push({ text: i + 1 + '', callback_data: `vcot: ${bookAbbr} ${chapter} ${i + 1}` });
            colCount = 1;
        }
    }
    //flush last line
    if (subKeyboard.length != 0) {
        inline_keyboard.push(subKeyboard);
    }
    //check if back and forward button are necessary
    if (verseCount > __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardHeight, "f") * __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardWidth, "f")) {
        inline_keyboard.push([{ text: "⏮ Back Verses", callback_data: `bxvot: ${bookAbbr} ${chapter} ${start}` }, { text: "Forward Verses ⏭", callback_data: `fxvot: ${bookAbbr} ${chapter} ${i}` }]);
    }
    //Back to Book
    let book = __classPrivateFieldGet(this, _ProcessMessage_bible, "f").abbrToBook(bookAbbr);
    inline_keyboard.push([{ text: `◀️ Go Back to ${book}`, callback_data: `bbot: ${bookAbbr}` }]);
    let keyboard = { inline_keyboard };
    return keyboard;
}, _ProcessMessage_getChapterKeyboard = function _ProcessMessage_getChapterKeyboard(bookAbbr, chapterCount, testament, start = 0) {
    let inline_keyboard = [];
    let colCount = 0, subKeyboard = [];
    let i = start;
    for (; i < chapterCount; i++) {
        if (colCount < __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardWidth, "f")) {
            subKeyboard.push({ text: i + 1 + '', callback_data: `cot: ${bookAbbr} ${i + 1}` });
            colCount++;
        }
        else {
            inline_keyboard.push(subKeyboard);
            subKeyboard = [];
            //check if max height for keyboard is attained
            if (inline_keyboard.length == __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardHeight, "f")) {
                break;
            }
            subKeyboard.push({ text: i + 1 + '', callback_data: `cot: ${bookAbbr} ${i + 1}` });
            colCount = 1;
        }
    }
    //flush last line
    if (subKeyboard.length != 0) {
        inline_keyboard.push(subKeyboard);
    }
    //check if back and forward button are necessary
    if (chapterCount > __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardHeight, "f") * __classPrivateFieldGet(this, _ProcessMessage_maxKeyBoardWidth, "f")) {
        inline_keyboard.push([{ text: "⏮ Back Chapters", callback_data: `bxot: ${bookAbbr} ${start}` }, { text: "Forward Chapters ⏭", callback_data: `fxot: ${bookAbbr} ${i}` }]);
    }
    //Back to Books
    let text = testament == "xot" ? "◀️ Go Back to Old Testament" : "◀️ Go Back to New Testament";
    inline_keyboard.push([{ text, callback_data: `${testament}` }]);
    let keyboard = { inline_keyboard };
    return keyboard;
}, _ProcessMessage_oldTestamentKeyboard = function _ProcessMessage_oldTestamentKeyboard() {
    let inline_keyboard = [];
    inline_keyboard.push([{ text: "Genesis", callback_data: "ot: gn" }, { text: "Exodus", callback_data: "ot: ex" }, { text: "Leviticus", callback_data: "ot: lv" },]);
    inline_keyboard.push([{ text: "Numbers", callback_data: "ot: nm" }, { text: "Deuteronomy", callback_data: "ot: dt" }, { text: "Joshua", callback_data: "ot: js" },]);
    inline_keyboard.push([{ text: "Judges", callback_data: "ot: jud" }, { text: "Ruth", callback_data: "ot: rt" }, { text: "1 Samuel", callback_data: "ot: 1sm" },]);
    inline_keyboard.push([{ text: "2 Samuel", callback_data: "ot: 2sm" }, { text: "1 Kings", callback_data: "ot: 1kgs" }, { text: "2 Kings", callback_data: "ot: 2kgs" },]);
    inline_keyboard.push([{ text: "1 Chronicles", callback_data: "ot: 1ch" }, { text: "2 Chronicles", callback_data: "ot: 2ch" }, { text: "Ezra", callback_data: "ot: ezr" },]);
    inline_keyboard.push([{ text: "Nehemiah", callback_data: "ot: ne" }, { text: "Esther", callback_data: "ot: et" }, { text: "Job", callback_data: "ot: job" },]);
    inline_keyboard.push([{ text: "Psalms", callback_data: "ot: ps" }, { text: "Proverbs", callback_data: "ot: prv" }, { text: "Ecclesiastes", callback_data: "ot: ec" },]);
    inline_keyboard.push([{ text: "Song of Solomon", callback_data: "ot: so" }, { text: "Isaiah", callback_data: "ot: is" }, { text: "Jeremiah", callback_data: "ot: jr" },]);
    inline_keyboard.push([{ text: "Lamentations", callback_data: "ot: lm" }, { text: "Ezekiel", callback_data: "ot: ez" }, { text: "Daniel", callback_data: "ot: dn" },]);
    inline_keyboard.push([{ text: "Hosea", callback_data: "ot: ho" }, { text: "Joel", callback_data: "ot: jl" }, { text: "Amos", callback_data: "ot: am" },]);
    inline_keyboard.push([{ text: "Obadiah", callback_data: "ot: ob" }, { text: "Jonah", callback_data: "ot: jn" }, { text: "Micah", callback_data: "ot: mi" },]);
    inline_keyboard.push([{ text: "Nahum", callback_data: "ot: na" }, { text: "Habakkuk", callback_data: "ot: hk" }, { text: "Zephaniah", callback_data: "ot: zp" },]);
    inline_keyboard.push([{ text: "Haggai", callback_data: "ot: hg" }, { text: "Zechariah", callback_data: "ot: zc" }, { text: "Malachi", callback_data: "ot: ml" },]);
    let keyboard = { inline_keyboard };
    return keyboard;
}, _ProcessMessage_newTestamentKeyboard = function _ProcessMessage_newTestamentKeyboard() {
    let inline_keyboard = [];
    inline_keyboard.push([{ text: "Matthew", callback_data: "nt: mt" }, { text: "Mark", callback_data: "nt: mk" }, { text: "Luke", callback_data: "nt: lk" },]);
    inline_keyboard.push([{ text: "John", callback_data: "nt: jo" }, { text: "Acts", callback_data: "nt: act" }, { text: "Romans", callback_data: "nt: rm" },]);
    inline_keyboard.push([{ text: "1 Corinthians", callback_data: "nt: 1co" }, { text: "2 Corinthians", callback_data: "nt: 2co" }, { text: "Galatians", callback_data: "nt: gl" },]);
    inline_keyboard.push([{ text: "Ephesians", callback_data: "nt: eph" }, { text: "Philippians", callback_data: "nt: ph" }, { text: "Colossians", callback_data: "nt: cl" },]);
    inline_keyboard.push([{ text: "1 Thessalonians", callback_data: "nt: 1ts" }, { text: "2 Thessalonians", callback_data: "nt: 2ts" }, { text: "1 Timothy", callback_data: "nt: 1tm" },]);
    inline_keyboard.push([{ text: "2 Timothy", callback_data: "nt: 2tm" }, { text: "Titus", callback_data: "nt: tt" }, { text: "Philemon", callback_data: "nt: phm" },]);
    inline_keyboard.push([{ text: "Hebrews", callback_data: "nt: hb" }, { text: "James", callback_data: "nt: jm" }, { text: "1 Peter", callback_data: "nt: 1pe" },]);
    inline_keyboard.push([{ text: "2 Peter", callback_data: "nt: 2pe" }, { text: "1 John", callback_data: "nt: 1jo" }, { text: "2 John", callback_data: "nt: 2jo" },]);
    inline_keyboard.push([{ text: "3 John", callback_data: "nt: 3jo" }, { text: "Jude", callback_data: "nt: jd" }, { text: "Revelation", callback_data: "nt: re" },]);
    let keyboard = { inline_keyboard };
    return keyboard;
};
module.exports = ProcessMessage;
