const NodeID3 = require('node-id3');

async function tag(filename: string, id3: any){
    id3.copyright = "https://t.me/HolyWritBot";
    id3.comment = {
        language: "eng",
        text: "https://t.me/HolyWritBot"
    };
    id3.publisher = "https://t.me/HolyWritBot";
    id3.encodedBy = "https://t.me/HolyWritBot";
    id3.artistUrl = ["https://t.me/HolyWritBot"];
    NodeID3.write(id3, filename, (err: any)=>{if(err) console.log(err);});
}

module.exports.tag = tag;