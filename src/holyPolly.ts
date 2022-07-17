const id3 = require("./tag");

export default class HolyPolly{
    #AWS; #Polly; #fs;
    
    /**
     * Fire up the Holy Polly :)
     */
    constructor(){
        // Load the SDK
        this.#AWS = require('aws-sdk');
        // Create an Polly client
        this.#Polly = new this.#AWS.Polly({
            signatureVersion: 'v4',
            region: 'us-east-1'
        });

        this.#fs = require('fs');
    }

    /**
     * Turn text to speech 
     * @param text Text to synthesize
     * @param filename Name to give the output mp3 file
     * @param voiceID Voice ID to use for the read out
     * @returns Returns the mp3 audio data stream
     */
    async speak(text: string, filename: string, voiceID: string): Promise<any>{

        const voices = require("../dataset/readoutVoice.json");

        let VoiceId = voices[voiceID].name;

        let params = {
            'Text': text,
            'OutputFormat': 'mp3',
            'VoiceId': VoiceId,
            //'Engine': 'standard',
            'Engine': 'neural'
        }

        let data = await this.#Polly.synthesizeSpeech(params).promise();
        let promise;
        promise = new Promise((resolve, reject)=>{
            this.#fs.writeFile(`/tmp/${filename}.mp3`, data.AudioStream, async ()=>{
                //Write ID3 tag
                const tags = {
                    title: filename,
                    artist: "Holy Writ / @HolyWritBot",
                    album: "The Bible",
                    APIC: './albumart.jpg',
                };
                await id3.tag(`/tmp/${filename}.mp3`, tags);
                
                //resolve 
                resolve(`/tmp/${filename}.mp3`);
            });
        });
        return promise;
    }
}
module.exports = HolyPolly;