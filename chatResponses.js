const axios = require("axios");
// const sensor = require("node-dht-sensor").promises;
let currentTimeStamp, botMessage;

module.exports = (client) =>
  client.on("messageCreate", async (msg) => {
    if (msg.author.bot === false) {
      handleHowdyCommand(msg);
      handleBtcCommand(msg);
      handleWhiteCastleCommand(msg);
      handleDepressedCommand(msg);
      handleCheckZipCommand(msg);
      handleBinaryToTextCommand(msg);
      // Uncomment the following line once you have the sensor, lcd, and binaryToText functions implemented
      // handleTempCheckCommand(msg, sensor, lcd);
      handleHelloHelloCommand(msg);
      handleInsultCommand(msg);
      handleOkayCommand(msg);
      handleBlackhawksScoreCommand(msg);
      handleHungryCommand(msg);
      handleHornyCommand(msg);
      handleFellAsleepCommand(msg);
      handle1234Command(msg);
      handleSeriousCommand(msg);
      handleCheeksCommand(msg);
      handleGoinOutCommand(msg);
      handleKatzCommand(msg);
      handleSiameseCommand(msg);
      handleMassiveCommand(msg);
      handleBlockCommand(msg);
      handleBeautyCommand(msg);
      handleChachiCommand(msg);
      handleBlowMeCommand(msg);
    }
  });

// Function to handle the "howdy" command
function handleHowdyCommand(msg, regex) {
  if (/howdy/i.test(msg.content)) {
    msg.reply(
      "https://tenor.com/view/howdy-ho-mr-hankey-south-park-season1ep10mr-hankey-the-christmas-poo-greetings-gif-19508083"
    );
  }
}

// Function to handle the "btc" command
async function handleBtcCommand(msg, regex) {
  if (/btc|bitcoin/i.test(msg.content)) {
    const btcPrice = await axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then((data) => data.data.bpi.USD.rate);
    msg.reply("$" + btcPrice);
  }
}

// Function to handle the "white castle" command
function handleWhiteCastleCommand(msg) {
  if (/white castle/i.test(msg.content) && /bad|gross|disgusting/i.test(msg.content)) {
    msg.reply("Sorry that adjective can not be used to describe White Castle");
  }
}

// Function to handle the "depressed" command
async function handleDepressedCommand(msg) {
  if (/i'?m depressed/i.test(msg.content)) {
    const cuteDogLink = await axios
      .get("https://dog.ceo/api/breeds/image/random")
      .then((data) => data.data.message);
    msg.reply("I hope this helps with your depression " + cuteDogLink);
  } else if (/im really depressed/i.test(msg.content)) {
    const cuteDogLinks = await Promise.all([
      axios.get("https://dog.ceo/api/breeds/image/random").then((data) => data.data.message),
      axios.get("https://dog.ceo/api/breeds/image/random").then((data) => data.data.message),
      axios.get("https://dog.ceo/api/breeds/image/random").then((data) => data.data.message),
    ]);

    msg.reply("I hope this helps with your super depression " + cuteDogLinks.join("\n"));
  }
}

// Function to handle the "checkZip" command
async function handleCheckZipCommand(msg) {
  if (/checkZip:/.test(msg.content) && msg.content.length >= 14) {
    const zipInfo = await axios
      .get(`http://api.zippopotam.us/us/${msg.content.substr(9, msg.content.length - 1)}`)
      .then((data) => `${data.data.places[0]["place name"]} ${data.data.places[0].state}`);

    msg.reply(zipInfo);
  }
}

// Function to handle the "binaryToText" command
function handleBinaryToTextCommand(msg) {
  if (/binaryToText:/.test(msg.content) && msg.content.length >= 21) {
    const text = binaryToText(msg.content.substr(13, msg.content.length - 1));
    msg.reply(text);
  }
}

// Function to handle the "tempCheck" command
async function handleTempCheckCommand(msg, sensor, lcd) {
  if (/tempCheck/i.test(msg.content)) {
    sensor.read(11, 4).then(
      (res) => {
        currentTimeStamp = new Date();
        lcd.display();
        lcd.clearSync();
        lcd.printLineSync(0, `temp: ${(res.temperature * (9 / 5) + 32).toFixed(1)}^F`);
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
}

// Function to handle the "hello hello" command
function handleHelloHelloCommand(msg) {
  if (/hello hello/i.test(msg.content)) {
    msg.reply("https://tenor.com/view/hello-there-hi-there-greetings-gif-9442662");
  }
}

// Function to handle insults
function handleInsultCommand(msg) {
  if (/fuck you bot|fuck off bot|i fucking hate the bot|bad bot|stupid bot/i.test(msg.content)) {
    msg.reply("suck my dick bitch");
  }
}

// Function to handle the "okay" commandfunction
function handleOkayCommand(msg) {
  if (/okay\?/i.test(msg.content)) {
    msg.reply("https://tenor.com/view/mmmkay-mr-mackey-south-park-alright-okay-gif-19580399");
  }
}

// Function to handle the "blackhawks score" command
async function handleBlackhawksScoreCommand(msg) {
  // API completely changed, this is broken
  if (/blackhawks score\?/i.test(msg.content)) {
    let reply = await axios
      .get(`https://statsapi.web.nhl.com/api/v1/schedule?teamId=${16}`)
      .then((data) => {
        if (data.data.totalGames > 0) {
          let returnString = "";
          let gameLink = `https://statsapi.web.nhl.com${data.data.dates[0].games[0].link}`;
          let gameStatus = axios.get(gameLink).then((data) => {
            let homeTeam = data.data.gameData.teams.home.name;
            let awayTeam = data.data.gameData.teams.away.name;
            let abstractGameState = data.data.gameData.status.abstractGameState;
            let gameStart = new Date(data.data.gameData.datetime.dateTime).toString().substr(15);

            if (abstractGameState === "Pre") {
              returnString = `${awayTeam} @ ${homeTeam} - ${abstractGameState}\n${gameStart}`;
            } else if (abstractGameState === "Live") {
              let period = data.data.liveData.linescore.currentPeriodOrdinal;
              let timeRemaining = data.data.liveData.linescore.currentPeriodTimeRemaining;
              let homeScore = data.data.liveData.plays.currentPlay.about.goals.home;
              let awayScore = data.data.liveData.plays.currentPlay.about.goals.away;

              returnString = `${awayTeam} @ ${homeTeam}\nScore: ${awayScore} - ${homeScore}\n${period} period\n${timeRemaining} time remaining`;
            } else {
              let homeScore = data.data.liveData.plays.currentPlay.about.goals.home;
              let awayScore = data.data.liveData.plays.currentPlay.about.goals.away;

              returnString = `${awayTeam} @ ${homeTeam}\nFinal Score: ${awayScore} - ${homeScore}`;
            }
            return returnString;
          });

          return gameStatus;
        } else {
          const startDate = new Date().toISOString().split("T")[0];
          const endDate = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

          return axios
            .get(
              `https://statsapi.web.nhl.com/api/v1/schedule?teamId=16&startDate=${startDate}&endDate=${endDate}`
            )
            .then((data) => {
              let nextGameDate = new Date(data.data.dates[0].games[0].gameDate).toString();
              let homeTeam = data.data.dates[0].games[0].teams.home.team.name;
              let awayTeam = data.data.dates[0].games[0].teams.away.team.name;

              return `No game today\n\nNext game:\n${awayTeam} @ ${homeTeam}\n${nextGameDate}`;
            });
        }
      });
    msg.reply(reply);
  }
}

// Function to handle the "I'm hungry" command
function handleHungryCommand(msg) {
  if (/i'?m hungry|i want food|what should i eat/i.test(msg.content)) {
    const foodOptions = [
      "White Castle",
      "Cava",
      "Chipotle",
      "Taco Bell",
      "Culver's",
      "Rubio's",
      "Panera bread",
      "Chipotle",
      "Canes",
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
}

// Function to handle the "who's horny" command
function handleHornyCommand(msg) {
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
}

// Function to handle the "fell asleep" command
function handleFellAsleepCommand(msg) {
  if (/fell asleep/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/fellasleep.jpeg", name: "fellasleep.jpeg" }],
    });
  }
}

// Function to handle the "12:34" command
function handle1234Command(msg) {
  if (/trash|garbage/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/1234.jpeg", name: "1234.jpeg" }],
    });
  }
}

// Function to handle the "serious" command
function handleSeriousCommand(msg) {
  if (/serious/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/progamer.jpeg" }],
    });
  }
}

// Function to handle the "cheeks" command
function handleCheeksCommand(msg) {
  if (/cheeks|cheeky/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/cheeksRossi.jpeg", name: "cheeksRossi.jpeg" }],
    });
    msg.channel.send({
      files: [{ attachment: "./img/cheeksMike.jpg", name: "cheeksMike.jpg" }],
    });
    msg.channel.send({
      files: [{ attachment: "./img/cheeks3.png", name: "cheeks3.png" }],
    });
  }
}

// Function to handle the "goin out" command
function handleGoinOutCommand(msg) {
  if (/goin out|going out|night life/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/goinout.jpeg", name: "goinout.jpeg" }],
    });
  }
}

// Function to handle the "katz" command
function handleKatzCommand(msg) {
  if (/katz|squad/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/catsquad.png", name: "catsquad.png" }],
    });
  }
}

// Function to handle the "siamese" command
function handleSiameseCommand(msg) {
  if (/siamese/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/siamese.png", name: "siamese.png" }],
    });
  }
}

// Function to handle the "massive" command
function handleMassiveCommand(msg) {
  if (/massive/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/massive.png", name: "massive.png" }],
    });
  }
}

// Function to handle the "block" command
function handleBlockCommand(msg) {
  if (/block/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/block.png", name: "block.png" }],
    });
  }
}

// Function to handle the "beautiful" command
function handleBeautyCommand(msg) {
  if (/beautiful|beauty/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/beauty.jpeg", name: "beauty.jpeg" }],
    });
  }
}

// Function to handle the "chachi" command
function handleChachiCommand(msg) {
  if (/chachi/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/chachi.jpeg", name: "chachi.jpeg" }],
    });
  }
}

// Function to handle the "blow me" command
function handleBlowMeCommand(msg) {
  if (/no no blow me|blow me/i.test(msg.content)) {
    msg.channel.send({
      files: [{ attachment: "./img/nonoblowme.jpg", name: "nonoblowme.jpg" }],
    });
  }
}
