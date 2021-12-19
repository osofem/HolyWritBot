const Prosperly = require("prosperly");
const ProcessMessage = require("./dist/processMessage");
const botToken = process.env.botToken;

let bot = new Prosperly({botToken});

exports.handler = async (event) => {
    let promise;
    let requestBody = event.body;
    let process = new ProcessMessage(requestBody, bot);
    promise = new Promise((resolve, reject)=>{
        process.execute().then((data)=>{
            const response = {
                statusCode: 200,
                body: '',
            };
            resolve(response);
        }).catch((err)=>{
            reject(err);
        });  
    });
    
    return promise;
};