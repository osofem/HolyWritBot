import Prosperly from "prosperly";
export default class ProcessMessage {
    #private;
    constructor(update: string, content: {
        bot: Prosperly;
        conString: string;
    });
    /**
     * Execute the current update
     */
    execute(): Promise<void>;
}
