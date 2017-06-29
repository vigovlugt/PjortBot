const Discord = require('discord.js');
const readline = require('readline');
const client = new Discord.Client();
const reactions = require('./reactions.js');
const fs = require("fs");
var reactionsDict = require('./reactions.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//SETTINGS
let prefix = "/";
let defaultChannel = "212202805467938816";


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

client.on('ready', () => {
  console.log(' I am ready!');
  setInterval(tenMin,600000);
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

    switch (command[0]) {
      case "pjort":
        help(message);
        break;

      case "addreaction":
        let splittedArgs = args.split(",");
        console.log(splittedArgs);

        if(splittedArgs.length != 2)
        {
          return;
        }
        for (var i = 0; i < splittedArgs.length; i++) {
          while (splittedArgs[i].charAt(0) == " ") {
            splittedArgs[i] = splittedArgs[i].substring(1);
          }
        }

        let newReact = "{\"message\":\"" + splittedArgs[0] + "\",\"reaction\":\"" + splittedArgs[1] + "\"}";
        console.log("Message added:");
        console.log(newReact);
        reactionsDict.push(JSON.parse(newReact));
        console.log(reactionsDict);
        fs.writeFile("./reactions.json",JSON.stringify(reactionsDict));
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

  }

});

function tenMin(){
  setAvatar();
  sendRandomMessage();
}


function help(message){
  var help = "goedendag, ik ben pjort. wat wilt u tegen mij zeggen?";
  for (var i = 0; i < reactionsDict.length; i++) {
    help += "\n -" + reactionsDict[i].message;
  }

  help += "\n";

  for (var i = 0; i < avatarMessages.length; i++) {
    help += "\n -" + avatarMessages[i].message;
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
]


client.login('MjY5NTI2OTI1MTAwMTg3NjQ4.DDQs7Q.kRnFjUGKVlc_Foj0KCetw1fTHM4');
