const fs = require('fs');
require("dotenv").config();
const { Client, Intents } = require("discord.js");
const axios = require("axios");
const sensor = require("node-dht-sensor").promises;
const LCD = require("raspberrypi-liquid-crystal");
const lcd = new LCD(1, 0x27, 16, 2);
lcd.beginSync();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("messageCreate", async (msg) => {
  const howdyRegex = /howdy/i;
  const btcRegex = /btc|bitcoin/i;

  if (msg.author.bot === false) {
    if (howdyRegex.test(msg.content)) {
      msg.reply(
        "https://tenor.com/view/howdy-ho-mr-hankey-south-park-season1ep10mr-hankey-the-christmas-poo-greetings-gif-19508083"
      );
    }
    if (btcRegex.test(msg.content)) {
      const btcPrice = await axios
        .get("https://api.coindesk.com/v1/bpi/currentprice.json")
        .then((data) => data.data.bpi.USD.rate);

      msg.reply(
        "its probably crashing, sell sell sell! \n\n JK its at $" + btcPrice
      );
    }
    if (
      /white castle/i.test(msg.content) &&
      /bad|gross|disgusting/i.test(msg.content)
    ) {
      msg.reply(
        "Sorry that adjective can not be used to describe White Castle"
      );
    }
    if (/i'?m depressed/i.test(msg.content)) {
      const cuteDogLink = await axios
        .get("https://dog.ceo/api/breeds/image/random")
        .then((data) => data.data.message);
      msg.reply("I hope this helps with your depression " + cuteDogLink);
    } else if (/im really depressed/i.test(msg.content)) {
      let cuteDogLink1 = await axios
        .get("https://dog.ceo/api/breeds/image/random")
        .then((data) => data.data.message);
      let cuteDogLink2 = await axios
        .get("https://dog.ceo/api/breeds/image/random")
        .then((data) => data.data.message);
      let cuteDogLink3 = await axios
        .get("https://dog.ceo/api/breeds/image/random")
        .then((data) => data.data.message);

      msg.reply(
        "I hope this helps with your super depression " +
          cuteDogLink1 +
          " \n " +
          cuteDogLink2 +
          " \n " +
          cuteDogLink3
      );
    }
    if (/checkZip:/.test(msg.content) && msg.content.length >= 14) {
      const zipInfo = await axios
        .get(
          `http://api.zippopotam.us/us/${msg.content.substr(
            9,
            msg.content.length - 1
          )}`
        )
        .then(
          (data) =>
            `${data.data.places[0]["place name"]} ${data.data.places[0].state}`
        );

      msg.reply(zipInfo);
    }
    if (/tempCheck/i.test(msg.content)) {
      sensor.read(11, 4).then(
        (res) => {
          currentTimeStamp = new Date();

          lcd.display();
          lcd.clearSync();
          lcd.printLineSync(
            0,
            `temp: ${(res.temperature * (9 / 5) + 32).toFixed(1)}^F`
          );
          lcd.printLineSync(1, `humidity: ${res.humidity.toFixed(1)}%`);

          botMessage = `${currentTimeStamp.toLocaleTimeString()} ${currentTimeStamp.toLocaleDateString()}\ntemp: ${(
            res.temperature * (9 / 5) +
            32
          ).toFixed(1)}^F \nhumidity: ${res.humidity.toFixed(1)}%\n`;

          msg.reply(botMessage);
        },
        (err) => console.error(err)
      );
    }
    if (/hello hello/i.test(msg.content)) {
      msg.reply(
        "https://tenor.com/view/hello-there-hi-there-greetings-gif-9442662"
      );
    }
    if (/okay\?/i.test(msg.content)) {
      msg.reply(
        "https://tenor.com/view/mmmkay-mr-mackey-south-park-alright-okay-gif-19580399"
      );
    }

    // if (/come over|anyone doing anything|anyone around/i.test(msg.content)) {
    //   client.channels.cache.get(msg.channelId).send("Kill youself.");

    //   setTimeout(() => {
    //     client.channels.cache.get(msg.channelId).send("...");
    //   }, 1500);
    //   setTimeout(() => {
    //     client.channels.cache
    //       .get(msg.channelId)
    //       .send("dont actually do that..");
    //   }, 3000);
    // }
    if (/new games/i.test(msg.content)) {
      msg.reply(
        "10/08/2021 - Metroid Dread\n10/22/2021 - Battlefield 2042\n10/29/2021 - Mario Party Superstars\n11/19/2021 - Pokemon Brilliant Diamond\n11/19/2021 - Shining Pearl\n01/28/2022 - Pokemon Legends Arceus"
      );
    }
    if (/i'?m hungry|i want food|what should i eat/i.test(msg.content)) {
      const foodOptions = [
        "White Castle",
        "Chipotle",
        "Taco Bell",
        "Rubio's",
        "Panera bread",
        "Chipotle",
        "Canes",
        "Culver's",
        "Chick fil a",
        "Five guys",
        "Smash burger",
        "In n out",
        "Whataburger",
        "Blaze",
        "Jersey Mike's",
        "Rosati's"
      ];
      msg.reply(foodOptions[Math.floor(Math.random() * foodOptions.length)]);
    }
    if (/who'?s horny/i.test(msg.content)) {
      msg.channel.send({ files: [{attachment: './img/maxrape.jpeg',name: 'maxrape.jpeg'}] });
    }
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.CLIENT_TOKEN); //login bot using token
