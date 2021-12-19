import Bible from "./bible";

export default class HolySearch extends Bible{

    constructor(){
        super();
    }

    async search(word: string): Promise<SearchResult[]>{
        let keys = Object.keys(this.bible);

        let results = [];

        for(let i = 0; i < keys.length; i++){
            let book = this.bible[keys[i]];
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
                            text: await this.refineVerseReadOut(verse)
                        }
                        results. push(result);
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
}

module.exports = HolySearch;