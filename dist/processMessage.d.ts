import Prosperly from "prosperly";
export default class ProcessMessage {
    #private;
    constructor(update: string, bot: Prosperly);
    /**
     * Execute the current update
     */
    execute(): Promise<void>;
}
