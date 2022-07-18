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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HolyPolly_AWS, _HolyPolly_Polly, _HolyPolly_fs;
Object.defineProperty(exports, "__esModule", { value: true });
const id3 = require("./tag");
class HolyPolly {
    /**
     * Fire up the Holy Polly :)
     */
    constructor() {
        _HolyPolly_AWS.set(this, void 0);
        _HolyPolly_Polly.set(this, void 0);
        _HolyPolly_fs.set(this, void 0);
        // Load the SDK
        __classPrivateFieldSet(this, _HolyPolly_AWS, require('aws-sdk'), "f");
        // Create an Polly client
        __classPrivateFieldSet(this, _HolyPolly_Polly, new (__classPrivateFieldGet(this, _HolyPolly_AWS, "f").Polly)({
            signatureVersion: 'v4',
            region: 'us-east-1'
        }), "f");
        __classPrivateFieldSet(this, _HolyPolly_fs, require('fs'), "f");
    }
    /**
     * Turn text to speech
     * @param text Text to synthesize
     * @param filename Name to give the output mp3 file
     * @param voiceID Voice ID to use for the read out
     * @returns Returns the mp3 audio data stream
     */
    speak(text, filename, voiceID) {
        return __awaiter(this, void 0, void 0, function* () {
            const voices = require("../dataset/readoutVoice.json");
            let VoiceId = voices[voiceID].name;
            let params = {
                'Text': text,
                'OutputFormat': 'mp3',
                'VoiceId': VoiceId,
                //'Engine': 'standard',
                'Engine': 'neural'
            };
            let data = yield __classPrivateFieldGet(this, _HolyPolly_Polly, "f").synthesizeSpeech(params).promise();
            let promise;
            promise = new Promise((resolve, reject) => {
                __classPrivateFieldGet(this, _HolyPolly_fs, "f").writeFile(`/tmp/${filename}.mp3`, data.AudioStream, () => __awaiter(this, void 0, void 0, function* () {
                    //Write ID3 tag
                    const tags = {
                        title: filename,
                        artist: "Holy Writ @HolyWritBot",
                        album: "The Bible",
                        APIC: './albumart.jpg',
                    };
                    yield id3.tag(`/tmp/${filename}.mp3`, tags);
                    //resolve 
                    resolve(`/tmp/${filename}.mp3`);
                }));
            });
            return promise;
        });
    }
}
exports.default = HolyPolly;
_HolyPolly_AWS = new WeakMap(), _HolyPolly_Polly = new WeakMap(), _HolyPolly_fs = new WeakMap();
module.exports = HolyPolly;
