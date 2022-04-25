import Bible from "./bible";
export default class HolySearch extends Bible {
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
};
