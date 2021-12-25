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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bible_1 = __importDefault(require("./bible"));
class HolySearch extends bible_1.default {
    constructor(content) {
        super(content);
    }
    search(word) {
        return __awaiter(this, void 0, void 0, function* () {
            //Load bible properly
            yield this.execute();
            let keys = Object.keys(this.bible);
            let results = [];
            for (let i = 0; i < keys.length; i++) {
                let book = this.bible[keys[i]];
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
                                text: yield this.refineVerseReadOut(verse)
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
module.exports = HolySearch;
