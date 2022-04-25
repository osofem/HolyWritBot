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
const NodeID3 = require('node-id3');
function tag(filename, id3) {
    return __awaiter(this, void 0, void 0, function* () {
        id3.copyright = "https://t.me/HolyWritBot";
        id3.comment = {
            language: "eng",
            text: "https://t.me/HolyWritBot"
        };
        id3.publisher = "https://t.me/HolyWritBot";
        id3.encodedBy = "https://t.me/HolyWritBot";
        id3.artistUrl = ["https://t.me/HolyWritBot"];
        NodeID3.write(id3, filename, (err) => { if (err)
            console.log(err); });
    });
}
module.exports.tag = tag;
