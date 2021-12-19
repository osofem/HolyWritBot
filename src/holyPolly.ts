export default class HolyPolly{
    #AWS; #Polly; #fs;
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
     * @returns Returns the mp3 audio data stream
     */
    async speak(text: string, filename: string): Promise<any>{
        let params = {
            'Text': text,
            'OutputFormat': 'mp3',
            'VoiceId': 'Kendra',
            'Engine': 'standard'
        }

        let data = await this.#Polly.synthesizeSpeech(params).promise();
        let promise;
        promise = new Promise((resolve, reject)=>{
            this.#fs.writeFile(`/tmp/${filename}.mp3`, data.AudioStream, ()=>{
                resolve(`/tmp/${filename}.mp3`);
            });
        });
        return promise;
    }
}
module.exports = HolyPolly;






