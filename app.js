require('dotenv').config();
const { Client, Intents } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('messageCreate', async msg => {
    const howdyRegex = /howdy/i;
    const btcRegex = /btc|bitcoin/i;

    if(msg.author.bot === false){
        if (howdyRegex.test(msg.content)) {
          msg.reply('https://tenor.com/view/howdy-ho-mr-hankey-south-park-season1ep10mr-hankey-the-christmas-poo-greetings-gif-19508083');
        }
        if(btcRegex.test(msg.content)){
            const btcPrice = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
            .then(data => data.data.bpi.USD.rate)

            msg.reply('its probably crashing, sell sell sell! \n\n JK its at $' + btcPrice);
        }
        if(/white castle/i.test(msg.content) && /bad|gross|disgusting/i.test(msg.content)){
            msg.reply('Sorry that adjective can not be used to describe White Castle');
        }
        if(/im depressed/i.test(msg.content)){
            const cuteDogLink = await axios.get('https://dog.ceo/api/breeds/image/random')
            .then(data => data.data.message)
            msg.reply("I hope this helps with your depression " + cuteDogLink);
        }
        else if(/im really depressed/i.test(msg.content)){
            let cuteDogLink1 = await axios.get('https://dog.ceo/api/breeds/image/random').then(data => data.data.message);
            let cuteDogLink2 = await axios.get('https://dog.ceo/api/breeds/image/random').then(data => data.data.message);
            let cuteDogLink3 = await axios.get('https://dog.ceo/api/breeds/image/random').then(data => data.data.message);

            msg.reply("I hope this helps with your super depression " + cuteDogLink1 + " \n " + cuteDogLink2 + " \n " + cuteDogLink3);
        }
        if(/checkZip:/.test(msg.content) && msg.content.length >= 14){
            const zipInfo = await axios.get(`http://api.zippopotam.us/us/${msg.content.substr(9,msg.content.length-1)}`)
            .then(data => `${data.data.places[0]["place name"]} ${data.data.places[0].state}`)

            msg.reply(zipInfo);
        }
    }
  });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.CLIENT_TOKEN); //login bot using token