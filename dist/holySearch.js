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
var _HolySearch_conString, _HolySearch_userID;
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("./DB"));
class HolySearch {
    constructor(content) {
        _HolySearch_conString.set(this, void 0);
        _HolySearch_userID.set(this, void 0);
        __classPrivateFieldSet(this, _HolySearch_conString, content.conString, "f");
        __classPrivateFieldSet(this, _HolySearch_userID, content.userID, "f");
    }
    search(word) {
        return __awaiter(this, void 0, void 0, function* () {
            //find user's selected edition
            let db = new DB_1.default(__classPrivateFieldGet(this, _HolySearch_conString, "f"));
            let edition = yield db.getCurrentEdition(__classPrivateFieldGet(this, _HolySearch_userID, "f"));
            let bible = require(`../dataset/${edition}.json`);
            let keys = Object.keys(bible);
            let results = [];
            for (let i = 0; i < keys.length; i++) {
                let book = bible[keys[i]];
                let chapters = book['chapters'];
                for (let j = 0; j < chapters.length; j++) {
                    let verses = chapters[j];
                    for (let k = 0; k < verses.length; k++) {
                        let verse = verses[k];
                        let pattern = new RegExp(`(${word})`, "gi");
                        if (verse.match(pattern) != null) {
                            let result = {
                                book: book.name,
                                bookAbbr: book.abbreviation,
                                chapter: j + 1,
                                verse: k + 1,
                                text: verse,
                                edition
                            };
                            results.push(result);
                        }
                    }
                }
            }
            return results;
        });
    }
}
exports.default = HolySearch;
_HolySearch_conString = new WeakMap(), _HolySearch_userID = new WeakMap();
module.exports = HolySearch;
