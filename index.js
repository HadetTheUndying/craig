#!/usr/bin/env node
const Discord = require('discord.js');
const client = new Discord.Client();
var token = require('./token.json'); //token file, you need this to bring the bot online
var config = require('./config.json'); //config file, also necessary (should already be included)
const { CommandHandler } = require("djs-commands")
const CH = new CommandHandler({
  folder: __dirname + '/modules/',
  prefix: [`${config.prefix}`]
});

client.on('ready', () => {
  console.log(`logged in as ${client.user.tag}!`);
  console.log(`https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot`);
  client.user.setActivity(`${config.activity}`);
  console.log(`Set activity to "${config.activity}"`);
});

// join message
client.on("guildMemberAdd" , member => {
    member.guild.channels.get(config.joinChannelID).send(`Everyone welcome <@${member.id}> to the server!`);
});

//command handling start
client.on("message", (message) => {
  if(message.channel.type === 'dm') return;
  if(message.author.type === 'bot') return;
  let args = message.content.split(" ");
  let command = args[0];
  let cmd = CH.getCommand(command);
  if(!cmd) return;

  try{
    cmd.run(client,message,args)
  }catch(e){
    console.log(e)
  }
});
//command handling end

client.on('error', console.error); //lol this is kind of necessary

client.login(`${token.token}`);