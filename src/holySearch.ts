import DB from "./DB";

export default class HolySearch{
    #conString: string; #userID: string;

    constructor(content: {conString: string; userID: string}){
        this.#conString = content.conString;
        this.#userID = content.userID;
    }

    async search(word: string): Promise<SearchResult[]>{
        
        //find user's selected edition
        let db = new DB(this.#conString);
        let edition = await db.getCurrentEdition(this.#userID);
        let bible = require(`../dataset/${edition}.json`);

        let keys = Object.keys(bible);

        let results = [];

        for(let i = 0; i < keys.length; i++){
            let book = bible[keys[i]];
            let chapters = book['chapters'];
            for(let j = 0; j < chapters.length; j++){
                let verses = chapters[j];
                for(let k = 0; k < verses.length; k++){
                    let verse = verses[k];
                    let pattern = new RegExp(`(${word})`, "gi");
                    if(verse.match(pattern) != null){
                        let result = {
                            book: book.name,
                            bookAbbr: book.abbreviation,
                            chapter: j+1,
                            verse: k+1,
                            text: verse,
                            edition
                        }
                        results.push(result);
                    }
                }
            }
        }
        return results;
    }
}

export type SearchResult = {
    book: string;
    bookAbbr: string;
    chapter: number;
    verse: number;
    text: string;
    edition : string;
}

module.exports = HolySearch;