export default class Bible {
    #private;
    constructor();
    verse(data: string): Promise<any>;
    /**
     * Get the number of chapters in a book
     * @param book The book (e.g. genesis)
     * @returns Returns the number of chapters in the specified book
     */
    getChapterCount(book: string): Promise<any>;
    /**
     * Get the number of verses in a chapter
     * @param book The book (e.g. genesis)
     * @param chapter The chapter (e.g. 1)
     * @returns Returns the number of verses in the specified chapter
     */
    getVerseCount(book: string, chapter: number): Promise<any>;
    /**
     * Look up bible verse from the database for read out
     * @param book The book name e.g. Genesis
     * @param chapter chapter to look up e.g. 1
     * @param verse Verse to look up e.g. 3
     * @returns Returns clean verse without tags
     */
    lookupForReadOut(book: string, chapter: number, verse: number): Promise<string>;
    /**
     * Map abbravition to book name
     * @param abbreviation Abbraviation to map (e.g. gn)
     * @returns Returns book name (e.g. return genesis for gn)
     */
    abbrToBook(abbreviation: string): string;
}
