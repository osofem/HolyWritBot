export default class Bible{
    bible: any; #os = require("os");

    constructor(){
        //load bible
        this.bible = require("../dataset/kjv.json");
    }

    async verse(data: string): Promise<any>{
        //data should be in the format [book chapter:verse] or [book chapter verse]
        let book, chapter, verse;
        let vdata = data.replace(/\s+/gi, " ").split(" ");
        if(vdata.length == 4){
            //e.g. 1 chronicles 3 4
            book = `${vdata[0]} ${vdata[1]}`;
            chapter = +vdata[2];
            verse = +vdata[3];
        }
        else if(vdata.length == 3){
            //e.g. 1 chronicles 3:4 or John 3 16
            if(vdata[2].includes(":")){
                //e.g. 1 chronicles 3:4
                book = `${vdata[0]} ${vdata[1]}`;
                chapter = +vdata[2].split(":")[0];
                verse = +vdata[2].split(":")[1];
            }
            else{
                //e.g. John 3 16
                book = vdata[0];
                chapter = +vdata[1];
                verse = +vdata[2];
            }
        }
        else if(vdata.length == 2){
            //e.g. john 3:16
            book = vdata[0];
            chapter = +vdata[1].split(":")[0];
            verse = +vdata[1].split(":")[1];
        }
        if(book && chapter && verse){
            let v = await this.#lookup(book, chapter, verse);
            if(v != "object"){
                v = await this.#refineVerse(v);
                let encodedVerse = `<b>${this.bible[book].name} ${chapter}:${verse}</b>${this.#os.EOL}${this.#os.EOL}${v}`;
                let keyboard = await this.#keyboard(book, chapter, verse);
                return {encodedVerse, keyboard};
            }
        }
        return undefined;
    }


    /**
     * Get the number of chapters in a book
     * @param book The book (e.g. genesis)
     * @returns Returns the number of chapters in the specified book
     */
    async getChapterCount(book: string){
        console.log(book);
        return this.bible[book]['chapters'].length;
    }

    /**
     * Get the number of verses in a chapter
     * @param book The book (e.g. genesis)
     * @param chapter The chapter (e.g. 1)
     * @returns Returns the number of verses in the specified chapter
     */
    async getVerseCount(book: string, chapter: number){
        return this.bible[book]['chapters'][chapter-1].length;
    }
    

    /**
     * Look up bible verse from the database
     * @param book The book name e.g. Genesis
     * @param chapter chapter to look up e.g. 1
     * @param verse Verse to look up e.g. 3
     * @returns Returns the verse
     */
    async #lookup(book: string, chapter: number, verse: number): Promise<string>{
        book = book.toLowerCase();
        try{
            let v = this.bible[book]['chapters'][chapter-1][verse-1];
            return v;
        }catch(e: any){
            return typeof e;
        }
    }

    /**
     * Look up bible verse from the database for read out
     * @param book The book name e.g. Genesis
     * @param chapter chapter to look up e.g. 1
     * @param verse Verse to look up e.g. 3
     * @returns Returns clean verse without tags
     */
     async lookupForReadOut(book: string, chapter: number, verse: number): Promise<string>{
        book = book.toLowerCase();
        try{
            let v = this.bible[book]['chapters'][chapter-1][verse-1];
            return await this.refineVerseReadOut(v);
        }catch(e: any){
            return "null";
        }
    }

    /**
     * Put words in curly braket in intalics
     * @param verse The verse
     * @returns Return verse with curly braket in intalics
     */
    async #refineVerse(verse: string): Promise<string>{
        verse = verse.replace(/(\{)((\w+\s*){1,})(\})/gi, "<i>$2</i>"); //Let {me go} now => Let <i>me go</i> now
        verse = verse.replace(/((\{)(([a-z\.\:\;\?\(\)\&\,\s]){1,})(\})$){1,}/gi, ""); //Let me go now {me.: procast?} => Let me go now
        return verse;
    }

    /**
     * Remove all curly brackets for readout without HTML tags
     * @param verse The verse
     * @returns Return verse in plain text without HTML tags
     */
    async refineVerseReadOut(verse: string): Promise<string>{
        verse = verse.replace(/(\{)((\w+\s*){1,})(\})/gi, "$2"); //Let {me go} now => Let me go now
        verse = verse.replace(/((\{)(([a-z\.\:\;\?\(\)\&\,\s]){1,})(\})$){1,}/gi, ""); //Let me go now {me.: procast?} => Let me go now
        return verse;
    }

    /**
     * Construct the inline keyboard for the verse
     * @param book The book name e.g. Genesis
     * @param chapter chapter to look up e.g. 1
     * @param verse Verse to look up e.g. 3 
     * @returns The inlinkeyboard associated with the verse
     */
    async #keyboard(book: string, chapter: number, verse: number){
        //If first verse, previous button should be omitted
        if(verse == 1){
            let inline_keyboard = [];
            inline_keyboard.push([
                { text: "🔈 Read Out", callback_data: `ro: ${this.bible[book].abbreviation} ${chapter} ${verse}`}, 
                { text: "⏭", callback_data: `next: ${this.bible[book].abbreviation} ${chapter} ${verse+1}`}
            ]);
            let keyboard = {inline_keyboard};
            return keyboard;
        }
        //If last verse, next button should be omitted
        else if(this.bible[book]['chapters'][chapter-1][verse] == undefined){
            let inline_keyboard = [];
            inline_keyboard.push([
                { text: "⏮", callback_data: `prev: ${this.bible[book].abbreviation} ${chapter} ${verse-1}`}, 
                { text: "🔈 Read Out", callback_data: `ro: ${this.bible[book].abbreviation} ${chapter} ${verse}` }
            ]);
            let keyboard = {inline_keyboard};
            return keyboard;
        }
        //show all button
        else{
            let inline_keyboard = [];
            inline_keyboard.push([
                { text: "⏮", callback_data: `prev: ${this.bible[book].abbreviation} ${chapter} ${verse-1}`}, 
                { text: "🔈 Read Out", callback_data: `ro: ${this.bible[book].abbreviation} ${chapter} ${verse}`}, 
                { text: "⏭", callback_data: `next: ${this.bible[book].abbreviation} ${chapter} ${verse+1}`}
            ]);
            let keyboard = {inline_keyboard};
            return keyboard;
        }
    }

    /**
     * Map abbravition to book name
     * @param abbreviation Abbraviation to map (e.g. gn)
     * @returns Returns book name (e.g. return genesis for gn)
     */
    abbrToBook(abbreviation: string): string{
        let abbr: any = {
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
        }
        return abbr[abbreviation];
    }

}

module.exports = Bible;