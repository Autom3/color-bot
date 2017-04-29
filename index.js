// Constants
const Discord = require('discord.js'),
	Config = require('./config.json'),
	Color = require('./color.js'),
	funcs = require('./functions.js'),
	Command = require('./command.js'),
	client = new Discord.Client(),
	prefix = Config.prefix;
const commands = [
	new Command('random', funcs.randomColors, "Generate <count> amount of random colors"),
	new Command('scheme', funcs.randomScheme, "Generate <count> of nice-looking color-schemeish colors"),
	new Command('idea', funcs.getIdea, "Generate random drawing ideas"),
	new Command('challenge', funcs.challenge, "Generate random drawing ideas with <count> random colors"),
	new Command('ask', funcs.ask, "woof"),
	new Command('idiot', funcs.idiot, "idiot", ['292645209672515584']),
	new Command('item', funcs.nameify, "you are wat u say u r", ['292645209672515584', '283009672028487681']),
	new Command('chucknorris', funcs.chucknorris, "CHUCK NORRIS"),
	new Command('ban', funcs.ban, 'Ban the user', ['292645209672515584', '283009672028487681']),
	new Command('code', funcs.code, 'Send source code of the bot')
];

// Check for commands
client.on('message', msg => {
	if (msg.content.toLowerCase().startsWith(prefix + "help")) {
		funcs.help(msg, commands, prefix);
	}
	for (let cmd of commands) {
		if (msg.content.toLowerCase().startsWith(prefix + cmd.name.toLowerCase())) {
			if (cmd.servers.length == 0) {
				cmd.execute(msg);
			} else if (cmd.servers.indexOf(msg.guild.id) != -1) {
				cmd.execute(msg);
			}
		}
	}
});
client.on("ready", () => {
	client.user.setPresence({
		game: {
			name: "Written by Orangalo#0983"
		}
	});
	console.log("READY!");
});
client.on("guildMemberAdd", member => {
	if (member.guild.id != '246366162282086400') {
		member.guild.defaultChannel.sendMessage(`Welcome ${member.displayName} to the "${member.guild.name} server!"`);
	}
});

client.login(Config.token);
