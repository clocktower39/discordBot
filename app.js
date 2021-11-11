const fs = require("fs");
require("dotenv").config();
const { Client, Intents, Options } = require("discord.js");
const axios = require("axios");
const sensor = require("node-dht-sensor").promises;
const LCD = require("raspberrypi-liquid-crystal");
const lcd = new LCD(1, 0x27, 16, 2);
lcd.beginSync();
const cron = require("node-cron");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  makeCache: Options.cacheEverything(),
});

const binaryToText = (str) => {
  let newBin = str.split(" ");
  let binCode = [];

  for (i = 0; i < newBin.length; i++) {
    binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
  }
  return binCode.join("");
};

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

      msg.reply("$" + btcPrice);
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
    if (/binaryToText:/.test(msg.content) && msg.content.length >= 21) {
      const text = binaryToText(msg.content.substr(13, msg.content.length - 1));

      msg.reply(text);
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
    if (/blackhawks score\?/i.test(msg.content)) {
      let reply = await axios
        .get(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=${16}`)
        .then((data) => {
          if (data.data.totalGames > 0) {
            let gameLink = `https://statsapi.web.nhl.com${data.data.dates[0].games[0].link}`;
            let gameStatus = axios.get(gameLink).then((data) => {
              let homeTeam = data.data.gameData.teams.home.name;
              let awayTeam = data.data.gameData.teams.away.name;

              let abstractGameState =
                data.data.gameData.status.abstractGameState;
              let gameStart = new Date(data.data.gameData.datetime.dateTime)
                .toString()
                .substr(15);

              return `${awayTeam} @ ${homeTeam} - ${abstractGameState}\n${gameStart}`;
            });

            return gameStatus;
          } else {
            const startDate = new Date().toISOString().split("T")[0];
            const endDate = new Date(
              new Date().getTime() + 5 * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0];
              
              return axios
              .get(
                `https://statsapi.web.nhl.com/api/v1/schedule?teamId=16&startDate=${startDate}&endDate=${endDate}`
              )
              .then((data) => {
                let nextGameDate = new Date(
                  data.data.dates[0].games[0].gameDate
                ).toString();
                let homeTeam = data.data.dates[0].games[0].teams.home.team.name;
                let awayTeam = data.data.dates[0].games[0].teams.away.team.name;

                return `No game today\n\nNext game:\n${awayTeam} @ ${homeTeam}\n${nextGameDate}`;
              });
          }
        });
      // console.log(reply)
      msg.reply(reply);
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
        "11/19/2021 - Pokemon Brilliant Diamond\n11/19/2021 - Shining Pearl\n12/08/2021 - Halo Infinite\n01/28/2022 - Pokemon Legends Arceus\n01/14/2022 - God of War\n02/25/2022 - Elden Ring\nSpring 2022 - Kirby and the Forgotten Land\n09/22/2022 - Test Drive Unlimied Solar Crown\n11/11/2022 - Starfield\n2022 - Beautiful Light"
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
        "Rosati's",
        "Sorry... Eat at home",
      ];
      msg.reply(foodOptions[Math.floor(Math.random() * foodOptions.length)]);
    }
    if (/who'?s horny/i.test(msg.content)) {
      msg.channel.send({
        files: [
          {
            attachment: "./img/unattractivemax.jpeg",
            name: "unattractivemax.jpeg",
          },
        ],
      });
    }
    if (/fell asleep/i.test(msg.content)) {
      msg.channel.send({
        files: [
          { attachment: "./img/fellasleep.jpeg", name: "fellasleep.jpeg" },
        ],
      });
    }
    if (msg.author.id === "531261983878807553" && /12:34/i.test(msg.content)) {
      msg.channel.send({
        files: [{ attachment: "./img/1234.jpeg", name: "1234.jpeg" }],
      });
    }
    if (/serious/i.test(msg.content)) {
      msg.channel.send({
        files: [{ attachment: "./img/progamer.jpeg", name: "progamer.jpeg" }],
      });
    }
    if (/cheeks|cheeky/i.test(msg.content)) {
      //   msg.channel.send({
      //     files: [{ attachment: "./img/cheeksRossi.jpeg", name: "cheeksRossi.jpeg" }],
      //   });
      //   msg.channel.send({
      //     files: [{ attachment: "./img/cheeksMike.jpg", name: "cheeksMike.jpg" }],
      //   });
      msg.channel.send({
        files: [{ attachment: "./img/cheeks3.png", name: "cheeks3.png" }],
      });
    }
    if (/goin out|going out|night life/i.test(msg.content)) {
      msg.channel.send({
        files: [{ attachment: "./img/goinout.jpeg", name: "goinout.jpeg" }],
      });
    }
    if (/katz|squad/i.test(msg.content)) {
      msg.channel.send({
        files: [{ attachment: "./img/catsquad.png", name: "catsquad.png" }],
      });
    }
    if (/siamese/i.test(msg.content)) {
      msg.channel.send({
        files: [{ attachment: "./img/siamese.png", name: "siamese.png" }],
      });
    }
    if (/massive/i.test(msg.content)) {
      msg.channel.send({
        files: [{ attachment: "./img/massive.png", name: "massive.png" }],
      });
    }
    if (/block/i.test(msg.content)) {
      msg.channel.send({
        files: [{ attachment: "./img/block.png", name: "block.png" }],
      });
    }
    if (/beautiful|beauty/i.test(msg.content)) {
      msg.channel.send({
        files: [{ attachment: "./img/beauty.jpeg", name: "beauty.jpeg" }],
      });
    }
    if (/chachi/i.test(msg.content)) {
      msg.channel.send({
        files: [{ attachment: "./img/chachi.jpeg", name: "chachi.jpeg" }],
      });
    }
    if (/no no blow me|blow me/i.test(msg.content)) {
      msg.channel.send({
        files: [{ attachment: "./img/nonoblowme.jpg", name: "nonoblowme.jpg" }],
      });
    }
    if (
      /zero hour/i.test(msg.content) &&
      msg.author.id !== "563515007204196383" &&
      msg.author.id !== "474394193058463754"
    ) {
      msg.channel.send(
        "https://tenor.com/view/lock-and-load-jesus-christ-south-park-s6e17-red-sleigh-down-gif-22105284"
      );
    }
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  //   cron.schedule("00 20 16 * * *", () => {
  //     client.channels.cache.get("604850815609339925").send("https://tenor.com/view/south-park-wann-get-high-towelie-gif-9114425");
  //   });

  // Birthdays
  cron.schedule("00 00 10 31 08 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("445733650080727061"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Connor!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 06 10 07 09 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("596172368397860866"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Michael!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 14 10 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("531261983878807553"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Sepsey!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 37 13 30 10 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("666019364578787328"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Britni!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 19 11 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("518898327052484659"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Dalton!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 28 12 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("743344697866453104"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Amy!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 13 04 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("761575454263083038"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Maria!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("55 20 07 25 04 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("474394193058463754"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Matt!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 21 07 25 04 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("563515007204196383"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Jon!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 13 08 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("884524352006160414"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Alyssa!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 30 12 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("707333871783641158"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Zach!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 16 11 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("691459930477297674"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Bri!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 10 11 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("381967069161455617"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Nick!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 07 06 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("539610074289799178"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Rossi!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 09 06 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("633378622010556417"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Fish!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 09 05 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("863613130055745577"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Izzy!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 11 05 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("545423011352936468"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Gengenfucker!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 18 12 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("304272208358932480"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday Mishall!!!!!!!! ${data.user}`);
      });
  });
  cron.schedule("00 00 10 11 01 *", () => {
    client.guilds
      .fetch("474394822937935883")
      .then((res) => res.members.fetch("703817561372098602"))
      .then((data) => {
        client.channels.cache
          .get("604850815609339925")
          .send(`Happy Birthday TrashDog!!!!!!!! ${data.user}`);
      });
  });
});

client.login(process.env.CLIENT_TOKEN); //login bot using token
