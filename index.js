const ProcessMessage = require("./dist/processMessage");

//Keys
const botToken = process.env.botToken;
const m3OKey = process.env.m3oKey;

//Update Cache
const UpdateTracker = require('./dist/updateTracker');
const updateTracker = new UpdateTracker({m3OKey});

//Prosperly bot
const Prosperly = require("prosperly");
let bot = new Prosperly({botToken});


exports.handler = async (event) => {

    let promise;
    let update = JSON.parse(event.body);

    await updateTracker.getUpdate(update.update_id).then(async _=>{
        if(_.value != ""){
            //Update seen before, discard
            return {statusCode: 200, body: ''};
        }else{
            /*New update, process*/
        
            //Save update to cache
            await updateTracker.setUpdate(update.update_id, update.toString());

            //process
            let requestBody = event.body;
            let process = new ProcessMessage(requestBody, {bot, m3oKey: m3OKey});
            promise = new Promise((resolve, reject)=>{
                process.execute().then(()=>{
                    resolve({statusCode: 200, body: ''});
                }).catch((err)=>{reject(err);});  
            });
        }
    }).catch(async _=>{
        //close gracefully
        return {statusCode: 200, body: ''};
    });
    
    return promise;
};