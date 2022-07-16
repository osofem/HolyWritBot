export default class HolySearch {
    #private;
    constructor(content: {
        conString: string;
        userID: string;
    });
    search(word: string): Promise<SearchResult[]>;
}
export declare type SearchResult = {
    book: string;
    bookAbbr: string;
    chapter: number;
    verse: number;
    text: string;
    edition: string;
};
