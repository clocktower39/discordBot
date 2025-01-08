const cron = require('node-cron');

module.exports = (client) => {
  const birthdays = [
    { memberId: "703817561372098602", date: "00 00 10 11 01", message: "Happy Birthday TrashDog!!!!!!!!" },
    { memberId: "725025349850759189", date: "00 00 10 29 01", message: "Happy Birthday CJ!!!!!!!!" },
    { memberId: "779953187208953887", date: "00 00 10 07 02", message: "Happy Birthday RISHHHHH!!!!!!!!" },
    { memberId: "761575454263083038", date: "00 00 10 13 04", message: "Happy Birthday Maria!!!!!!!!" },
    { memberId: "921580256593326157", date: "00 00 10 20 04", message: "Happy Birthday Vetter!!!!!!!!" },
    { memberId: "474394193058463754", date: "00 00 10 25 04", message: "Happy Birthday Matt!!!!!!!!" },
    { memberId: "563515007204196383", date: "00 00 10 25 04", message: "Happy Birthday Jon!!!!!!!!" },
    { memberId: "863613130055745577", date: "00 00 10 09 05", message: "Happy Birthday Izzy!!!!!!!!" },
    { memberId: "545423011352936468", date: "00 00 10 11 05", message: "Happy Birthday Gengenfucker!!!!!!!!" },
    { memberId: "539610074289799178", date: "00 00 10 07 06", message: "Happy Birthday Rossi!!!!!!!!" },
    { memberId: "633378622010556417", date: "00 00 10 09 06", message: "Happy Birthday Fish!!!!!!!!" },
    { memberId: "400281505621999617", date: "00 00 10 22 06", message: "Happy Birthday Carlos!!!!!!!!" },
    { memberId: "884524352006160414", date: "00 00 10 13 08", message: "Happy Birthday Alyssa!!!!!!!!" },
    { memberId: "445733650080727061", date: "00 00 10 31 08", message: "Happy Birthday Connor!!!!!!!!" },
    { memberId: "1096243220779905065", date: "00 00 10 02 09", message: "Happy Birthday Kat Arena!!!!!!!!" },
    { memberId: "596172368397860866", date: "00 03 11 07 09", message: "Michael is lame and cant see me but i guess Happy Birthday!!!!!!!!" },
    { memberId: "522883554729000961", date: "00 00 03 20 09", message: "Happy Birthday Trysten!!!!!!!!" },
    { memberId: "531261983878807553", date: "00 05 12 14 10", message: "Happy Birthday Sepsey!!!!!!!!" },
    { memberId: "666019364578787328", date: "00 00 10 30 10", message: "Happy Birthday Britni!!!!!!!!" },
    { memberId: "1159150156407648297", date: "00 00 10 05 11", message: "Happy Birthday Keely!!!!!!!!" },
    { memberId: "381967069161455617", date: "00 00 10 10 11", message: "Happy Birthday Nick!!!!!!!!" },
    { memberId: "691459930477297674", date: "00 00 10 16 11", message: "Happy Birthday Bri!!!!!!!!" },
    { memberId: "920302841841729607", date: "00 00 10 19 11", message: "Happy Birthday Dalton!!!!!!!!" },
    { memberId: "304272208358932480", date: "00 00 10 18 12", message: "Happy Birthday Mishall!!!!!!!!" },
    { memberId: "230106404180983809", date: "00 00 10 27 12", message: "Happy Birthday Juan!!!!!!!!" },
    { memberId: "743344697866453104", date: "00 00 10 28 12", message: "Happy Birthday Amy!!!!!!!!" },
    { memberId: "707333871783641158", date: "00 00 10 30 12", message: "Happy Birthday Zach!!!!!!!!" },
  ];

  const holidays = [ 
    { date: "00 00 00 01 01", message: "Happy New Year!!!!!!" },
    { date: "00 00 06 02 02", message: "Happy Groundhogs Day!!! \n https://images-ext-1.discordapp.net/external/IloRgoTTxEadf4xq_QcGs7eHnDT7sbNf_KE7C7LOOD0/https/media.tenor.com/YWArfj6Qe8YAAAPo/clock-alarm-clock.mp4" },
   ];

  birthdays.forEach(({ memberId, date, message }) => {
    const [second, minute, hour, day, month] = date.split(" ");

    cron.schedule(`${second} ${minute} ${hour} ${day} ${month} *`, () => {
      client.guilds
        .fetch("474394822937935883")
        .then((res) => res.members.fetch(memberId))
        .then((data) => {
          client.channels.cache
            .get("604850815609339925")
            .send(`${message} ${data.user}`);
        });
    });
  });
};