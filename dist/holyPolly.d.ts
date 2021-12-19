export default class HolyPolly {
    #private;
    constructor();
    /**
     * Turn text to speech
     * @param text Text to synthesize
     * @returns Returns the mp3 audio data stream
     */
    speak(text: string, filename: string): Promise<any>;
}
