const twit = require('twit');
const Web3 = require('web3');

const contractABI = require("./abi.json")
const contractAddress = "0x39338138414Df90EC67dC2EE046ab78BcD4F56D9"

const LogsDecoder = require('logs-decoder');  
const logsDecoder = LogsDecoder.create();
require('dotenv').config()

logsDecoder.addABI(contractABI);


const twitterConfig = {
    consumer_key:         process.env.API_Key,
    consumer_secret:     process.env.API_Secret,
    access_token:         process.env.Access_Token,
    access_token_secret: process.env.Access_Token_Secret,

};

console.log(twitterConfig)

const T = new twit(twitterConfig);

async function tweet(_solver,_challenge,_twitterHandle) {

    const tweetMessage = `Congratulation @${_twitterHandle} on solving ${_challenge} 🎉🎉🎉`

    T.post('statuses/update', { status:  tweetMessage }, function(err, data, response) {
        console.log(`Tweeted Successfully`)  
    })

}

const main = async() => {

    const options = {
        address:[contractAddress],
        topics : [
            '0x37442366d0b66ca2c3c71d814548641318cd87e6479a0bf3d0159595eca67425'
          ]
    };
    
    web3socket = new Web3(process.env.WEBSOCKET_URL);

    const subscription = web3socket.eth.subscribe('logs', options,async(err,event) => {
        if (!err)
        var tempEvent = [event]
        var element=(logsDecoder.decodeLogs(tempEvent))[0]
        var solver = element['events'][0]['value']
        var challenge = element['events'][1]['value']
        var twitterHandle = element['events'][2]['value']
        await tweet(solver,challenge,twitterHandle)
    })

    subscription.on('data', event => console.log())

}

main()