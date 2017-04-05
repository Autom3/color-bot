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
	new Command('ask', funcs.ask, "woof")
];

// Check for commands
client.on('message', msg => {
	if (msg.content.toLowerCase().indexOf(prefix + "help") === 0) {
		funcs.help(msg, commands, prefix);
	}
	for (let cmd of commands) {
		if (msg.content.toLowerCase().indexOf(prefix + cmd.name) === 0) {
			cmd.execute(msg);
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
})

client.login(Config.token);
