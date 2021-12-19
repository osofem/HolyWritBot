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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Bible_instances, _Bible_os, _Bible_lookup, _Bible_refineVerse, _Bible_keyboard;
Object.defineProperty(exports, "__esModule", { value: true });
class Bible {
    constructor() {
        _Bible_instances.add(this);
        _Bible_os.set(this, require("os"));
        //load bible
        this.bible = require("../dataset/kjv.json");
    }
    verse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            //data should be in the format [book chapter:verse] or [book chapter verse]
            let book, chapter, verse;
            let vdata = data.replace(/\s+/gi, " ").split(" ");
            if (vdata.length == 4) {
                //e.g. 1 chronicles 3 4
                book = `${vdata[0]} ${vdata[1]}`;
                chapter = +vdata[2];
                verse = +vdata[3];
            }
            else if (vdata.length == 3) {
                //e.g. 1 chronicles 3:4 or John 3 16
                if (vdata[2].includes(":")) {
                    //e.g. 1 chronicles 3:4
                    book = `${vdata[0]} ${vdata[1]}`;
                    chapter = +vdata[2].split(":")[0];
                    verse = +vdata[2].split(":")[1];
                }
                else {
                    //e.g. John 3 16
                    book = vdata[0];
                    chapter = +vdata[1];
                    verse = +vdata[2];
                }
            }
            else if (vdata.length == 2) {
                //e.g. john 3:16
                book = vdata[0];
                chapter = +vdata[1].split(":")[0];
                verse = +vdata[1].split(":")[1];
            }
            if (book && chapter && verse) {
                let v = yield __classPrivateFieldGet(this, _Bible_instances, "m", _Bible_lookup).call(this, book, chapter, verse);
                if (v != "object") {
                    v = yield __classPrivateFieldGet(this, _Bible_instances, "m", _Bible_refineVerse).call(this, v);
                    let encodedVerse = `<b>${this.bible[book].name} ${chapter}:${verse}</b>${__classPrivateFieldGet(this, _Bible_os, "f").EOL}${__classPrivateFieldGet(this, _Bible_os, "f").EOL}${v}`;
                    let keyboard = yield __classPrivateFieldGet(this, _Bible_instances, "m", _Bible_keyboard).call(this, book, chapter, verse);
                    return { encodedVerse, keyboard };
                }
            }
            return undefined;
        });
    }
    /**
     * Get the number of chapters in a book
     * @param book The book (e.g. genesis)
     * @returns Returns the number of chapters in the specified book
     */
    getChapterCount(book) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(book);
            return this.bible[book]['chapters'].length;
        });
    }
    /**
     * Get the number of verses in a chapter
     * @param book The book (e.g. genesis)
     * @param chapter The chapter (e.g. 1)
     * @returns Returns the number of verses in the specified chapter
     */
    getVerseCount(book, chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bible[book]['chapters'][chapter - 1].length;
        });
    }
    /**
     * Look up bible verse from the database for read out
     * @param book The book name e.g. Genesis
     * @param chapter chapter to look up e.g. 1
     * @param verse Verse to look up e.g. 3
     * @returns Returns clean verse without tags
     */
    lookupForReadOut(book, chapter, verse) {
        return __awaiter(this, void 0, void 0, function* () {
            book = book.toLowerCase();
            try {
                let v = this.bible[book]['chapters'][chapter - 1][verse - 1];
                return yield this.refineVerseReadOut(v);
            }
            catch (e) {
                return "null";
            }
        });
    }
    /**
     * Remove all curly brackets for readout without HTML tags
     * @param verse The verse
     * @returns Return verse in plain text without HTML tags
     */
    refineVerseReadOut(verse) {
        return __awaiter(this, void 0, void 0, function* () {
            verse = verse.replace(/(\{)((\w+\s*){1,})(\})/gi, "$2"); //Let {me go} now => Let me go now
            verse = verse.replace(/((\{)(([a-z\.\:\;\?\(\)\&\,\s]){1,})(\})$){1,}/gi, ""); //Let me go now {me.: procast?} => Let me go now
            return verse;
        });
    }
    /**
     * Map abbravition to book name
     * @param abbreviation Abbraviation to map (e.g. gn)
     * @returns Returns book name (e.g. return genesis for gn)
     */
    abbrToBook(abbreviation) {
        let abbr = {
            "gn": "genesis",
            "ex": "exodus",
            "lv": "leviticus",
            "nm": "numbers",
            "dt": "deuteronomy",
            "js": "joshua",
            "jud": "judges",
            "rt": "ruth",
            "1sm": "1 samuel",
            "2sm": "2 samuel",
            "1kgs": "1 kings",
            "2kgs": "2 kings",
            "1ch": "1 chronicles",
            "2ch": "2 chronicles",
            "ezr": "ezra",
            "ne": "nehemiah",
            "et": "esther",
            "job": "job",
            "ps": "psalms",
            "prv": "proverbs",
            "ec": "ecclesiastes",
            "so": "song of solomon",
            "is": "isaiah",
            "jr": "jeremiah",
            "lm": "lamentations",
            "ez": "ezekiel",
            "dn": "daniel",
            "ho": "hosea",
            "jl": "joel",
            "am": "amos",
            "ob": "obadiah",
            "jn": "jonah",
            "mi": "micah",
            "na": "nahum",
            "hk": "habakkuk",
            "zp": "zephaniah",
            "hg": "haggai",
            "zc": "zechariah",
            "ml": "malachi",
            "mt": "matthew",
            "mk": "mark",
            "lk": "luke",
            "jo": "john",
            "act": "acts",
            "rm": "romans",
            "1co": "1 corinthians",
            "2co": "2 corinthians",
            "gl": "galatians",
            "eph": "ephesians",
            "ph": "philippians",
            "cl": "colossians",
            "1ts": "1 thessalonians",
            "2ts": "2 thessalonians",
            "1tm": "1 timothy",
            "2tm": "2 timothy",
            "tt": "titus",
            "phm": "philemon",
            "hb": "hebrews",
            "jm": "james",
            "1pe": "1 peter",
            "2pe": "2 peter",
            "1jo": "1 john",
            "2jo": "2 john",
            "3jo": "3 john",
            "jd": "jude",
            "re": "revelation"
        };
        return abbr[abbreviation];
    }
}
exports.default = Bible;
_Bible_os = new WeakMap(), _Bible_instances = new WeakSet(), _Bible_lookup = function _Bible_lookup(book, chapter, verse) {
    return __awaiter(this, void 0, void 0, function* () {
        book = book.toLowerCase();
        try {
            let v = this.bible[book]['chapters'][chapter - 1][verse - 1];
            return v;
        }
        catch (e) {
            return typeof e;
        }
    });
}, _Bible_refineVerse = function _Bible_refineVerse(verse) {
    return __awaiter(this, void 0, void 0, function* () {
        verse = verse.replace(/(\{)((\w+\s*){1,})(\})/gi, "<i>$2</i>"); //Let {me go} now => Let <i>me go</i> now
        verse = verse.replace(/((\{)(([a-z\.\:\;\?\(\)\&\,\s]){1,})(\})$){1,}/gi, ""); //Let me go now {me.: procast?} => Let me go now
        return verse;
    });
}, _Bible_keyboard = function _Bible_keyboard(book, chapter, verse) {
    return __awaiter(this, void 0, void 0, function* () {
        //If first verse, previous button should be omitted
        if (verse == 1) {
            let inline_keyboard = [];
            inline_keyboard.push([
                { text: "🔈 Read Out", callback_data: `ro: ${this.bible[book].abbreviation} ${chapter} ${verse}` },
                { text: "⏭", callback_data: `next: ${this.bible[book].abbreviation} ${chapter} ${verse + 1}` }
            ]);
            let keyboard = { inline_keyboard };
            return keyboard;
        }
        //If last verse, next button should be omitted
        else if (this.bible[book]['chapters'][chapter - 1][verse] == undefined) {
            let inline_keyboard = [];
            inline_keyboard.push([
                { text: "⏮", callback_data: `prev: ${this.bible[book].abbreviation} ${chapter} ${verse - 1}` },
                { text: "🔈 Read Out", callback_data: `ro: ${this.bible[book].abbreviation} ${chapter} ${verse}` }
            ]);
            let keyboard = { inline_keyboard };
            return keyboard;
        }
        //show all button
        else {
            let inline_keyboard = [];
            inline_keyboard.push([
                { text: "⏮", callback_data: `prev: ${this.bible[book].abbreviation} ${chapter} ${verse - 1}` },
                { text: "🔈 Read Out", callback_data: `ro: ${this.bible[book].abbreviation} ${chapter} ${verse}` },
                { text: "⏭", callback_data: `next: ${this.bible[book].abbreviation} ${chapter} ${verse + 1}` }
            ]);
            let keyboard = { inline_keyboard };
            return keyboard;
        }
    });
};
module.exports = Bible;
