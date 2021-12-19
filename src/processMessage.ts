import Prosperly from "prosperly";
import { InlineKeyboardMarkup } from "prosperly/dist/typealiases/inlineKeyboardMarkup";
import { contentParam } from "./aliases/contentParam";
import Bible from "./bible";
import HolyPolly from "./holyPolly"

export default class ProcessMessage{
    #update: any; #bot: Prosperly; #bible: Bible; #os = require("os");
    #maxKeyBoardHeight = 5; #maxKeyBoardWidth = 5;

    constructor(update: string, bot: Prosperly){
        this.#update = JSON.parse(update); 
        this.#bot = bot;
        this.#bible = new Bible();
    }

    /**
     * Execute the current update
     */
     async execute(){
        let update = this.#update;
        //message //////////////////////
        if(typeof update['message'] !== 'undefined'){
            let content: contentParam = {chatID: update['message']['chat']['id'], text: update['message']['text']};
            content.date = update['message']['date'];
            content.type = update['message']['chat']['type'];
            content.messageID = update['message']['message_id'];
            await this.#processMessage(content);
        }

        //inline query //////////////////////
        if(typeof update['inline_query'] !== 'undefined'){
            let content: contentParam = {chatID: update['inline_query']['from']['id']};
            content.queryID = update['inline_query']['id'];
            content.queryData = update['inline_query']['query'];
            await this.#processInlineQuery(content);
        }

        //callback query //////////////////////
        if(typeof update['callback_query'] !== 'undefined'){
            let content: contentParam = {chatID: update['callback_query']['from']['id']};
            content.queryID = update['callback_query']['id'];
            content.queryData = update['callback_query']['data'];
            content.messageID = update['callback_query']['message']['message_id'];
            await this.#processCallbackQuery(content);
        }
    }


    async #processMessage(content: contentParam){
        if(content.text == "/start"){
            let firstName = JSON.parse(await this.#bot.getChat(content.chatID))['result']['first_name'];
            await this.#bot.sendMessage({
                chat_id: content.chatID,
                text: "Hello "+firstName+"! I am the Holy Writ bot, your one-stop bot for your bible straight with Telegram."+this.#os.EOL+this.#os.EOL+
                "To use me, simply send the bible verse in the format <b><code>book chapter:verse</code></b> (e.g. <b><i>1 John 2:5</i></b>). Or better still, use the bot commands!",
                parse_mode: "HTML"
            });
        }
        else if(content.text == "/oldtestament"){
            let keyboard: InlineKeyboardMarkup = this.#oldTestamentKeyboard();
            await this.#bot.sendMessage({
                chat_id: content.chatID,
                text: "Old Testament ⬇️",
                parse_mode: "HTML",
                reply_markup: keyboard 
            });
        }
        else if(content.text == "/newtestament"){
            let keyboard: InlineKeyboardMarkup = this.#newTestamentKeyboard();
            await this.#bot.sendMessage({
                chat_id: content.chatID,
                text: "New Testament ⬇️",
                parse_mode: "HTML",
                reply_markup: keyboard 
            });
        }
        else if(content.text == "/stat"){
            await this.#bot.sendMessage({
                chat_id: content.chatID,
                text: "📊 <b>Bot Statistics</b>"+this.#os.EOL+this.#os.EOL+
                "<i>Coming soon!</i>",
                parse_mode: "HTML"
            });
        }
        else{
            if(content.text){
                let v = await this.#bible.verse(content.text.toLowerCase());
                if(v.encodedVerse != undefined){
                    await this.#bot.sendMessage({
                        chat_id: content.chatID,
                        text: v.encodedVerse,
                        parse_mode: "HTML",
                        reply_markup: v.keyboard
                    });
                }
                else{
                    await this.#bot.sendMessage({
                        chat_id: content.chatID,
                        text: "I could not find the verse you are looking for. Please ensure your spellings are correct and in the format <code>book chapter:verse</code> (e.g. <i>1 John 2:5</i>). Or better still, use the bot commands!",
                        parse_mode: "HTML"
                    });
                }
                
            }
            
        }
    }

    async #processInlineQuery(content: contentParam){

    }

    async #processCallbackQuery(content: contentParam){
        let query = content.queryData?content.queryData:"";
        //Previous verse e.g. 'prev: prv 18 23'
        if(query.substr(0, 5) == "prev:"){
            let bookAbbr = query.split(" ")[1];
            let book = this.#bible.abbrToBook(bookAbbr);
            let chapter = +query.split(" ")[2];
            let verse = +query.split(" ")[3];
            let v = await this.#bible.verse(`${book} ${chapter}:${verse}`);
            if(v.encodedVerse != undefined){
                await this.#bot.editMessageText({
                    chat_id: content.chatID,
                    message_id: content.messageID,
                    text: v.encodedVerse,
                    parse_mode: "HTML",
                    reply_markup: v.keyboard
                });
            }
        }
        //Next verse e.g. 'next: jl 2 19'
        if(query.substr(0, 5) == "next:"){
            let bookAbbr = query.split(" ")[1];
            let book = this.#bible.abbrToBook(bookAbbr);
            let chapter = +query.split(" ")[2];
            let verse = +query.split(" ")[3];
            let v = await this.#bible.verse(`${book} ${chapter}:${verse}`);
            if(v.encodedVerse != undefined){
                await this.#bot.editMessageText({
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
        if(query.substr(0, 3) == "ot:" || query.substr(0, 5) == "bbot:"){
            let bookAbbr = query.split(" ")[1];
            let book = this.#bible.abbrToBook(bookAbbr);
            let chapterCounter = await this.#bible.getChapterCount(book);
            let keyboard = this.#getChapterKeyboard(bookAbbr, chapterCounter, "xot");
            await this.#bot.editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book}</b>: now choose the chapter ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //Back to Old Testament
        else if(query == "xot"){
            let keyboard: InlineKeyboardMarkup = this.#oldTestamentKeyboard();
            await this.#bot.editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: "Old Testament ⬇️",
                parse_mode: "HTML",
                reply_markup: keyboard 
            });
        }
        //forward the chapter selection: e.g. 'fxot: ps 25' (psalms from chapter 26 upwards)
        else if(query.substr(0, 5) == "fxot:"){
            let bookAbbr = query.split(" ")[1];
            let start = +query.split(" ")[2];
            let book = this.#bible.abbrToBook(bookAbbr);
            let chapterCounter = await this.#bible.getChapterCount(book);
            let keyboard = this.#getChapterKeyboard(bookAbbr, chapterCounter, "xot", start);
            await this.#bot.editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book}</b>: now choose the chapter ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //back chapter selection: e.g. 'bxot: gn 25' (psalms from chapter 25 downwards)
        else if(query.substr(0, 5) == "bxot:"){
            let bookAbbr = query.split(" ")[1];
            let matrixCount = this.#maxKeyBoardHeight * this.#maxKeyBoardWidth;
            let start = (+query.split(" ")[2]-matrixCount <= 0)? 0 : (+query.split(" ")[2]-matrixCount);
            let book = this.#bible.abbrToBook(bookAbbr);
            let chapterCounter = await this.#bible.getChapterCount(book);
            let keyboard = this.#getChapterKeyboard(bookAbbr, chapterCounter, "xot", start);
            await this.#bot.editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book}</b>: now choose the chapter ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //selected old testament chapter e.g. 'cot: ps 88' (psalms 88)
        else if(query.substr(0, 4) == "cot:"){
            let bookAbbr = query.split(" ")[1];
            let chapter = +query.split(" ")[2];
            let book = this.#bible.abbrToBook(bookAbbr);
            let verseCounter = await this.#bible.getVerseCount(book, chapter);
            let keyboard = this.#getVerseKeyboard(bookAbbr, chapter, verseCounter);
            await this.#bot.editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book} ${chapter}</b>: now choose the verse ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //verse selected e.g. 'vcot: jl 3 13'
        else if(query.substr(0, 5) == "vcot:"){
            let bookAbbr = query.split(" ")[1];
            let chapter = +query.split(" ")[2];
            let book = this.#bible.abbrToBook(bookAbbr);
            let verse = +query.split(" ")[3];
            let v = await this.#bible.verse(`${book} ${chapter}:${verse}`);
            if(v.encodedVerse != undefined){
                await this.#bot.editMessageText({
                    chat_id: content.chatID,
                    message_id: content.messageID,
                    text: v.encodedVerse,
                    parse_mode: "HTML",
                    reply_markup: v.keyboard
                });
            }
        }
        //forward the verse selection: e.g. 'fxvot: prv 31 25' (proverbs chapter 31 from verse 26 upwards)
        else if(query.substr(0, 6) == "fxvot:"){
            let bookAbbr = query.split(" ")[1];
            let chapter = +query.split(" ")[2];
            let start = +query.split(" ")[3];
            let book = this.#bible.abbrToBook(bookAbbr);
            let verseCounter = await this.#bible.getVerseCount(book, chapter);
            let keyboard = this.#getVerseKeyboard(bookAbbr, chapter, verseCounter, start);
            await this.#bot.editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book} ${chapter}</b>: now choose the verse ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //back the verse selection: e.g. 'bxvot: prv 31 25' (proverbs chapter 31 from verse 25 downwards)
        else if(query.substr(0, 6) == "bxvot:"){
            let bookAbbr = query.split(" ")[1];
            let chapter = +query.split(" ")[2];
            let matrixCount = this.#maxKeyBoardHeight * this.#maxKeyBoardWidth;
            let start = (+query.split(" ")[3]-matrixCount <= 0)? 0 : (+query.split(" ")[3]-matrixCount);
            let book = this.#bible.abbrToBook(bookAbbr);
            let verseCounter = await this.#bible.getVerseCount(book, chapter);
            let keyboard = this.#getVerseKeyboard(bookAbbr, chapter, verseCounter, start);
            await this.#bot.editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book} ${chapter}</b>: now choose the verse ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        
        //New Testament Chapters
        //Select old testament book (e.g. 'nt: lk')
        if(query.substr(0, 3) == "nt:"){
            let bookAbbr = query.split(" ")[1];
            let book = this.#bible.abbrToBook(bookAbbr);
            let chapterCounter = await this.#bible.getChapterCount(book);
            let keyboard = this.#getChapterKeyboard(bookAbbr, chapterCounter, "xnt");
            await this.#bot.editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: `<b>${book}</b>: now choose the chapter ⬇️`,
                parse_mode: "HTML",
                reply_markup: keyboard
            });
        }
        //Back to New Testament
        else if(query == "xnt"){
            let keyboard: InlineKeyboardMarkup = this.#newTestamentKeyboard();
            await this.#bot.editMessageText({
                chat_id: content.chatID,
                message_id: content.messageID,
                text: "New Testament ⬇️",
                parse_mode: "HTML",
                reply_markup: keyboard 
            });
        }

        //Read out: Polly (e.g. 'ro: lk 1 2')
        if(query.substr(0, 3) == "ro:"){
            const holyPolly: HolyPolly = new HolyPolly(); //do NOT move to constructor, takes a lot of time to initialise
            let bookAbbr = query.split(" ")[1];
            let book = this.#bible.abbrToBook(bookAbbr);

            let chapter = +query.split(" ")[2];
            let verse = +query.split(" ")[3];
            let text = await this.#bible.lookupForReadOut(book, chapter, verse);

            let filename = await holyPolly.speak(text, `${book} ${chapter}:${verse}`);
            await this.#bot.sendAudio({
                chat_id: content.chatID,
                audio: filename,
                caption: `${book} ${chapter}:${verse}`+this.#os.EOL+this.#os.EOL+"@HolyWritBot",
                parse_mode: "HTML",
                reply_to_message_id: content.messageID
            });
        }

        //Answer the query
        await this.#bot.answerCallbackQuery({
            callback_query_id: content.queryID?content.queryID:"0",
            text: "Request Answered!"
        });
    }


    #getVerseKeyboard(bookAbbr: string, chapter: number, verseCount: number,  start: number = 0): InlineKeyboardMarkup{
        let inline_keyboard = [];
        let colCount = 0, subKeyboard = [];
        let i = start;
        for(; i < verseCount; i++){
            if(colCount < this.#maxKeyBoardWidth){
                subKeyboard.push({ text: i+1+'', callback_data: `vcot: ${bookAbbr} ${chapter} ${i+1}`});
                colCount++;
            }
            else{
                inline_keyboard.push(subKeyboard);
                subKeyboard = [];
                //check if max height for keyboard is attained
                if(inline_keyboard.length == this.#maxKeyBoardHeight){break;}
                subKeyboard.push({ text: i+1+'', callback_data: `vcot: ${bookAbbr} ${chapter} ${i+1}`});
                colCount=1;
            }
        }
        //flush last line
        if(subKeyboard.length != 0){inline_keyboard.push(subKeyboard);}

        //check if back and forward button are necessary
        if(verseCount > this.#maxKeyBoardHeight * this.#maxKeyBoardWidth){
            inline_keyboard.push([{ text: "⏮ Back Verses", callback_data: `bxvot: ${bookAbbr} ${chapter} ${start}`}, { text: "Forward Verses ⏭", callback_data: `fxvot: ${bookAbbr} ${chapter} ${i}`}]);
        }
        
        //Back to Book
        let book = this.#bible.abbrToBook(bookAbbr);
        inline_keyboard.push([{ text: `◀️ Go Back to ${book}`, callback_data: `bbot: ${bookAbbr}`}]);
        let keyboard = {inline_keyboard};
        return keyboard;
    }

    #getChapterKeyboard(bookAbbr: string, chapterCount: number, testament: string, start: number = 0): InlineKeyboardMarkup{
        let inline_keyboard = [];
        let colCount = 0, subKeyboard = [];
        let i = start;
        for(; i < chapterCount; i++){
            if(colCount < this.#maxKeyBoardWidth){
                subKeyboard.push({ text: i+1+'', callback_data: `cot: ${bookAbbr} ${i+1}`});
                colCount++;
            }
            else{
                inline_keyboard.push(subKeyboard);
                subKeyboard = [];
                //check if max height for keyboard is attained
                if(inline_keyboard.length == this.#maxKeyBoardHeight){break;}
                subKeyboard.push({ text: i+1+'', callback_data: `cot: ${bookAbbr} ${i+1}`});
                colCount=1;
            }
        }
        //flush last line
        if(subKeyboard.length != 0){inline_keyboard.push(subKeyboard);}

        //check if back and forward button are necessary
        if(chapterCount > this.#maxKeyBoardHeight * this.#maxKeyBoardWidth){
            inline_keyboard.push([{ text: "⏮ Back Chapters", callback_data: `bxot: ${bookAbbr} ${start}`}, { text: "Forward Chapters ⏭", callback_data: `fxot: ${bookAbbr} ${i}`}]);
        }
        
        //Back to Books
        let text = testament=="xot"?"◀️ Go Back to Old Testament":"◀️ Go Back to New Testament";
        inline_keyboard.push([{ text, callback_data: `${testament}`}]);
        let keyboard = {inline_keyboard};
        return keyboard;
    }

    #oldTestamentKeyboard(): InlineKeyboardMarkup{
        let inline_keyboard = [];
        inline_keyboard.push([{ text: "Genesis", callback_data: "ot: gn"},{ text: "Exodus", callback_data: "ot: ex"},{ text: "Leviticus", callback_data: "ot: lv"},]);
        inline_keyboard.push([{ text: "Numbers", callback_data: "ot: nm"},{ text: "Deuteronomy", callback_data: "ot: dt"},{ text: "Joshua", callback_data: "ot: js"},]);
        inline_keyboard.push([{ text: "Judges", callback_data: "ot: jud"},{ text: "Ruth", callback_data: "ot: rt"},{ text: "1 Samuel", callback_data: "ot: 1sm"},]);
        inline_keyboard.push([{ text: "2 Samuel", callback_data: "ot: 2sm"},{ text: "1 Kings", callback_data: "ot: 1kgs"},{ text: "2 Kings", callback_data: "ot: 2kgs"},]);
        inline_keyboard.push([{ text: "1 Chronicles", callback_data: "ot: 1ch"},{ text: "2 Chronicles", callback_data: "ot: 2ch"},{ text: "Ezra", callback_data: "ot: ezr"},]);
        inline_keyboard.push([{ text: "Nehemiah", callback_data: "ot: ne"},{ text: "Esther", callback_data: "ot: et"},{ text: "Job", callback_data: "ot: job"},]);
        inline_keyboard.push([{ text: "Psalms", callback_data: "ot: ps"},{ text: "Proverbs", callback_data: "ot: prv"},{ text: "Ecclesiastes", callback_data: "ot: ec"},]);
        inline_keyboard.push([{ text: "Song of Solomon", callback_data: "ot: so"},{ text: "Isaiah", callback_data: "ot: is"},{ text: "Jeremiah", callback_data: "ot: jr"},]);
        inline_keyboard.push([{ text: "Lamentations", callback_data: "ot: lm"},{ text: "Ezekiel", callback_data: "ot: ez"},{ text: "Daniel", callback_data: "ot: dn"},]);
        inline_keyboard.push([{ text: "Hosea", callback_data: "ot: ho"},{ text: "Joel", callback_data: "ot: jl"},{ text: "Amos", callback_data: "ot: am"},]);
        inline_keyboard.push([{ text: "Obadiah", callback_data: "ot: ob"},{ text: "Jonah", callback_data: "ot: jn"},{ text: "Micah", callback_data: "ot: mi"},]);
        inline_keyboard.push([{ text: "Nahum", callback_data: "ot: na"},{ text: "Habakkuk", callback_data: "ot: hk"},{ text: "Zephaniah", callback_data: "ot: zp"},]);
        inline_keyboard.push([{ text: "Haggai", callback_data: "ot: hg"},{ text: "Zechariah", callback_data: "ot: zc"},{ text: "Malachi", callback_data: "ot: ml"},]);
    
        let keyboard = {inline_keyboard};
        return keyboard;
    }
    
    #newTestamentKeyboard(): InlineKeyboardMarkup{
        let inline_keyboard = [];
        inline_keyboard.push([{ text: "Matthew", callback_data: "nt: mt"},{ text: "Mark", callback_data: "nt: mk"},{ text: "Luke", callback_data: "nt: lk"},]);
        inline_keyboard.push([{ text: "John", callback_data: "nt: jo"},{ text: "Acts", callback_data: "nt: act"},{ text: "Romans", callback_data: "nt: rm"},]);
        inline_keyboard.push([{ text: "1 Corinthians", callback_data: "nt: 1co"},{ text: "2 Corinthians", callback_data: "nt: 2co"},{ text: "Galatians", callback_data: "nt: gl"},]);
        inline_keyboard.push([{ text: "Ephesians", callback_data: "nt: eph"},{ text: "Philippians", callback_data: "nt: ph"},{ text: "Colossians", callback_data: "nt: cl"},]);
        inline_keyboard.push([{ text: "1 Thessalonians", callback_data: "nt: 1ts"},{ text: "2 Thessalonians", callback_data: "nt: 2ts"},{ text: "1 Timothy", callback_data: "nt: 1tm"},]);
        inline_keyboard.push([{ text: "2 Timothy", callback_data: "nt: 2tm"},{ text: "Titus", callback_data: "nt: tt"},{ text: "Philemon", callback_data: "nt: phm"},]);
        inline_keyboard.push([{ text: "Hebrews", callback_data: "nt: hb"},{ text: "James", callback_data: "nt: jm"},{ text: "1 Peter", callback_data: "nt: 1pe"},]);
        inline_keyboard.push([{ text: "2 Peter", callback_data: "nt: 2pe"},{ text: "1 John", callback_data: "nt: 1jo"},{ text: "2 John", callback_data: "nt: 2jo"},]);
        inline_keyboard.push([{ text: "3 John", callback_data: "nt: 3jo"},{ text: "Jude", callback_data: "nt: jd"},{ text: "Revelation", callback_data: "nt: re"},]);

    
        let keyboard = {inline_keyboard};
        return keyboard;
    }
}

module.exports = ProcessMessage;