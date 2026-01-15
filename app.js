const fs = require("fs");
require("dotenv").config();
const { Client, GatewayIntentBits, Options } = require("discord.js");
const axios = require("axios");
// const sensor = require("node-dht-sensor").promises;
const cronJobs = require("./cronJobs");
const chatResponses = require("./chatResponses");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  makeCache: Options.cacheEverything(),
});

const timeoutDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

const binaryToText = (str) => {
  let newBin = str.split(" ");
  let binCode = [];

  for (i = 0; i < newBin.length; i++) {
    binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
  }
  return binCode.join("");
};

chatResponses(client);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  cronJobs(client);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  let date_time = new Date();
  let date = ("0" + date_time.getDate()).slice(-2);
  let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
  let year = date_time.getFullYear();
  let hours = date_time.getHours();
  let minutes = date_time.getMinutes();
  let seconds = date_time.getSeconds();
  let printTimestamp = () => `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

  const member = newState.member;

  if (!member || !newState.channel) return; // Exit if the user did not join a voice channel

  try {
    // Fetch the guild and admin member
    const guild = await client.guilds.fetch("474394822937935883");
    const admin = await guild.members.fetch("474394193058463754");

    // Fetch member presence, pulling it from the gateway when not cached.
    let fetchedMember = guild.members.cache.get(member.id) ?? member;
    if (!fetchedMember.presence) {
      fetchedMember = await guild.members.fetch({ user: member.id, withPresences: true, force: true });
    }
    const hasPresence = Boolean(fetchedMember.presence);
    const status = fetchedMember.presence?.status;

    if (!hasPresence || status === "offline" || status === "invisible") {
      // Disconnect the user
      await newState.setChannel(null);

      // Notify the user, admin, and log channel
      const reason = !hasPresence ? "no presence data" : status;
      await member.send("You have been disconnected from the voice channel for being offline, invisible, or missing presence.");
      await admin.user.send(`${member.user.tag} was disconnected for ${reason}.`);
      await client.channels.cache
        .get("604850815609339925")
        .send(`<@${member.id}> was disconnected from the voice channel (${reason}).`);
      
      console.log(`Disconnected ${member.user.tag} for ${reason}.`);
    }
  } catch (error) {
    console.error(`Error processing voiceStateUpdate for ${member.user.tag}:`, error);
  }
});


client.login(process.env.CLIENT_TOKEN); //login bot using token
