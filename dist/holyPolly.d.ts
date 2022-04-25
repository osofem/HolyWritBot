export default class HolyPolly {
    #private;
    /**
     * Fire up the Holy Polly :)
     */
    constructor();
    /**
     * Turn text to speech
     * @param text Text to synthesize
     * @param filename Name to give the output mp3 file
     * @param voiceID Voice ID to use for the read out
     * @returns Returns the mp3 audio data stream
     */
    speak(text: string, filename: string, voiceID: string): Promise<any>;
}
