const ProcessMessage = require("./dist/processMessage");

//Keys
const botToken = process.env.botToken;
const conString = process.env.conString;

//Update Cache
const UpdateTracker = require('./dist/updateTracker');
const updateTracker = new UpdateTracker({conString});

//Prosperly bot
const Prosperly = require("prosperly");
let bot = new Prosperly({botToken});


exports.handler = async (event) => {

    let promise;
    let update = JSON.parse(event.body);

    await updateTracker.getUpdate(update.update_id).then(async _=>{
        //Check if update was never received before or is 7 days or more old.
        if(_ == null || (+new Date() - _.ttl > (7*24*60*60*1000))){
            /*New update, process*/
        
            //Save update to cache
            await updateTracker.setUpdate(update.update_id, JSON.stringify(update));

            //process
            let requestBody = event.body;
            let process = new ProcessMessage(requestBody, {bot, conString});
            promise = new Promise((resolve, reject)=>{
                process.execute().then(()=>{
                    resolve({statusCode: 200, body: ''});
                }).catch((err)=>{reject(err);});  
            });
        }
        else{
            //Update seen before, discard
            return {statusCode: 200, body: ''};
        }
    }).catch(async _=>{
        //close gracefully
        return {statusCode: 200, body: ''};
    });
    
    return promise;
};