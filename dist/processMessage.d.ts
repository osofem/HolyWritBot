import Prosperly from "prosperly";
export default class ProcessMessage {
    #private;
    constructor(update: string, content: {
        bot: Prosperly;
        m3oKey: string;
    });
    /**
     * Execute the current update
     */
    execute(): Promise<void>;
}
