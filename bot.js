const Discord = require('discord.js');
const client = new Discord.Client();
const readline = require('readline');
const reactions = require('./reactions.js');
const fs = require("fs");
var reactionsDict = require('./reactions.json');
var pjortMoneys = require('./pjortmoneys.json');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var pjortMoneysDict = {};

//SETTINGS
let prefix = "/";
let defaultChannel = "329601822132273152";


client.on('ready', () => {
  console.log(' I am ready!');
  setInterval(oneHour,3600000);
  setupPjortMoneys();

});

//defaultChannel = client.channels.get(defaultChannel);
console.log(defaultChannel);
rl.on('line', (input) => {
 if(input[0] != prefix)
 {
   return;
 }

  var command = input.split(" ");
  command[0] = command[0].substring(1);
  let args = "";
  for (var i = 1; i < command.length; i++) {
    args += " " + command[i];
  }

  switch (command[0]) {

    case "say":

    client.channels.get(defaultChannel).send(args);
    console.log("message: " + args + " send.")
      break;
    case "tts":
    client.channels.get(defaultChannel).send(args,{tts: true});
    console.log("message: " + args + " send.")
      break;

    case "test":
      console.log("tstign")
      break;

      case "setgame":
        client.user.setGame(args);
        console.log("game: " + args + " set.")
      break;
      case "setstatus":
        client.user.setStatus(args);
        console.log("status: " + args + " set.")
      break;
      case "starttyping":
        client.channels.get(defaultChannel).startTyping();
      break;
      case "stoptyping":
        client.channels.get(defaultChannel).stopTyping();
      break;
    }



});






client.on('message', message => {

  message.content = message.content.toLowerCase();

  if(message.content.startsWith(prefix)){
    var command = message.content.split(" ");
    command[0] = command[0].substring(1);
    let args = "";
    for (var i = 1; i < command.length; i++) {
      args += " " + command[i];
    }
    let splittedArgs = args.split(",");
    console.log(splittedArgs);


    for (var i = 0; i < splittedArgs.length; i++) {
      while (splittedArgs[i].charAt(0) == " ") {
        splittedArgs[i] = splittedArgs[i].substring(1);
      }
    }


    switch (command[0]) {
      case "pjort":
      case "help":
      case "p":
        help(message);
        break;
        // REACTIONS
      case "addreaction":
      case "ar":
        if(splittedArgs.length != 2)
        {
          return;
        }
        let newReact = {"message": splittedArgs[0], "reaction": splittedArgs[1] };
        console.log("Message added:");
        console.log(JSON.stringify(newReact));
        reactionsDict.push(newReact);
        console.log(reactionsDict);
        fs.writeFile("./reactions.json",JSON.stringify(reactionsDict),(err) => {console.log(err);});
        break;



      //PJORTMONEYS
      case "pjortmoney":
      case "$":

        if(pjortMoneysDict[message.author.id] != null){
          message.channel.send(pjortMoneys[pjortMoneysDict[message.author.id]].money + "$");
        }else{
          registerPjortMoneys(message.author.id);
          message.channel.send("0$");
        }

        break;

        // STEENPAPIERSCHAAR
        case "sps":

        if(isNaN(command[2])){
          message.reply("je moet me niet testen");
          return;
        }



          if(pjortMoneys[pjortMoneysDict[message.author.id]].money < parseInt(command[2])){
            message.reply("je bent te brokko");
            break;
          }

          let pjortSps = Math.floor(Math.random() * 3);
          let playerSps = command[1];
          let winner;

          if(command[1] == "steen"){
          playerSps = 0;
        }else if (command[1] == "papier") {
          playerSps = 1;
        }else if (command[1] == "schaar") {
          playerSps = 2;
        }else if(command[1] == (0 || 1 || 2)){
          message.reply("je moet me niet testen");
          break;
        }


          if(pjortSps == playerSps){
            message.reply("gelijkspel, goed gestreden");
            break;
          }else if (pjortSps == 0 && playerSps == 1){
            winner = "player";
          }else if (pjortSps == 0 && playerSps == 2) {
            winner = "pjort";
          }else if (pjortSps == 1 && playerSps == 0) {
            winner = "pjort"
          }else if (pjortSps == 1 && playerSps == 2) {
            winner = "player"
          }else if (pjortSps == 2 && playerSps == 0) {
            winner = "player"
          }else if (pjortSps == 2 && playerSps == 1) {
            winner = "pjort"
          }

          let pjortChoice;

          switch (pjortSps) {
            case 0:
              pjortChoice = "steen";
              break;
            case 1:
              pjortChoice = "papier";
              break;
            case 2:
              pjortChoice = "schaar";
            break;
          }



          message.channel.send("ik kies jou! " + pjortChoice);

          if(winner == "pjort"){
            message.reply("ik win, natuurlijk, natuurlijk");


          }else{
            message.reply("ik krijg jou nog wel te pakken ventje");
          }

          let bet = parseInt(command[2]);

          if(bet == null){
            break;
          }

          if(winner == "pjort"){
            pjortMoneys[pjortMoneysDict[message.author.id]].money -= bet ;
          }else{
            pjortMoneys[pjortMoneysDict[message.author.id]].money += bet;
          }
          savePjortMoneys();
          message.channel.send("nu heb je: " + pjortMoneys[pjortMoneysDict[message.author.id]].money + "$")


          break;

        }

  }else{

    for (var i = 0; i < reactionsDict.length; i++) {
      if (reactionsDict[i].message == message.content) {
        message.channel.send(reactionsDict[i].reaction);
        break;
      }
    }

    for (var i = 0; i < avatarMessages.length; i++) {
      if (avatarMessages[i].message == message.content) {

        let randomNum = Math.floor(Math.random() * pjorts.length);
        let fileName = pjorts[randomNum];
        let randomMessage = Math.floor(Math.random() * avatarReactions.length)

        message.channel.send(avatarReactions[randomMessage].message);
        message.channel.sendFile("./PJORTS/" + fileName);
        break;
      }
    }

    switch (message.content) {
      case "pjort je bent lief":
        pjortMoneys[pjortMoneysDict[message.author.id]].money += 1;
        message.channel.send("nu heb je " + pjortMoneys[pjortMoneysDict[message.author.id]].money + "$");
        break;
      case "pjort, ik zou je doen":
        pjortMoneys[pjortMoneysDict[message.author.id]].money += 2;
        message.channel.send("nu heb je " + pjortMoneys[pjortMoneysDict[message.author.id]].money + "$");
        break;

    }


  }

});

function setupPjortMoneys(){
  for (var i = 0; i < pjortMoneys.length; i++) {
      pjortMoneysDict[pjortMoneys[i].id] = i;
  }
}

function savePjortMoneys(){
  fs.writeFile("./pjortmoneys.json",JSON.stringify(pjortMoneys),(err) => {console.log(err);});
}

function oneHour(){
  setAvatar();
  sendRandomMessage();
}

function registerPjortMoneys(id){
  let newUser = {"id":id,"money":0};
  pjortMoneys.push(newUser);
  savePjortMoneys();
}

function help(message){
  var help = "goedendag, ik ben pjort. wat wilt u tegen mij zeggen?";
  for (var i = 0; i < reactionsDict.length; i++) {
    help += "\n - " + reactionsDict[i].message;
  }

  help += "\n";

  for (var i = 0; i < avatarMessages.length; i++) {
    help += "\n - " + avatarMessages[i].message;
  }
  message.channel.send(help);
}

let pjorts = [];
fs.readdir("./PJORTS", (err, files) => {
  files.forEach(file => {
    pjorts.push(file);
  });
})

function sendRandomMessage()
{
  let randomMessage = Math.floor(Math.random() * randomMessages.length)
  client.channels.get(defaultChannel).send(randomMessages[randomMessage].message);
}

function setAvatar()
{
  let randomNum = Math.floor(Math.random() * pjorts.length);

  let fileName = pjorts[randomNum];
  console.log(fileName);
  client.user.setAvatar(fs.readFileSync('./PJORTS/' + fileName));
}

var avatarMessages = [
  {"message":"wie houdt er van penissen"},
  {"message":"wie houdt er van kaas"},
  {"message":"wie is gay"},
  {"message":"wie gaat dik"}
]
var avatarReactions = [
  {"message":"deze jongen"},
  {"message":"ikke"},
  {"message":"wat denk je zelf zemmel"},
  {"message":"ik natuurlijk"}
]

var randomMessages = [
  {"message":"ik wil kaas"},
  {"message":"ik ben te cool voor jullie allemaal"},
  {"message":"aambeien > aardbeien"},
  {"message":"ik ga zo dik"},
  {"message":"ik ben zo fk hard"},
  {"message":"je moet me niet schreeuwen"},
  {"message":"jezus wat ben ik cool"},
  {"message":"slapen is voor de zwakken"},
  {"message":"#Trump NR.1"},
  {"message":"altijd wanneer ik kleine jongentjes zie word mijn penis zo dik"},
  {"message":"#Trump NR.1"},
]


client.login('MjY5NTI2OTI1MTAwMTg3NjQ4.DDQs7Q.kRnFjUGKVlc_Foj0KCetw1fTHM4');
