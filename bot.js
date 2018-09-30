const discord = require("discord.js");
const YTDL = require('ytdl-core');
const TOKEN = ("NDk1ODk1NTc1NDUyMTg4Njgy.DpIuuA.9dy1b11y4bK2t9k8hAR--B2P6_g");
const prefix = "-";

function play (connection , message) {
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    server.queue.shift();
    server.dispatcher.on("end" , function(){
        if(server.queue[0]) play(connection , message);
        else connection.disconnect();
    });
}

var bot = new discord.Client();
var servers = {};

bot.on("ready", function () {
    bot.user.setActivity("KIKI DO YOU LOVE ME?!", { type: "PLAYING" })
    console.log('Miko is online!');
});
bot.on("message", function (message) {
    if (message.author.equals(bot.user)) return;
    if (!message.content.startsWith(prefix)) return;
    var arguments = message.content.substring(prefix.length).split(" ");
    let messageArray = message.content.split(' ');
    let command = messageArray[0];
    let arguments1 = messageArray.slice(1);

   
    //----------------------------------------Normal Commands----------------------------------------//

    switch (arguments[0].toLowerCase()) {

     //----------------------------------------Music Commands-----------------------------------------------//

        case "play":
        if(!arguments[1]){
            message.channel.sendMessage('T^T... Give Me A Link!!');
            return;
        }
        if(!message.member.voiceChannel){
            message.channel.sendMessage('T^T... Enter To The Voice Channel!!');
            return;
        }
        if(!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        };
        var server = servers[message.guild.id];

        server.queue.push(arguments[1]);

        if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
            play(connection , message);
        });
        break;

        case "skip":
        var server = servers[message.guild.id];
        if(server.dispatcher) server.dispatcher.end();
        break;

        case "stop":
        var server = servers[message.guild.id]; 
        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
        break;

        default:
        message.channel.sendMessage('oh...Command Not Found...T^T..')
        break;
}})
bot.login(TOKEN);
