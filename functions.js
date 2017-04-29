const Color = require('./color.js'),
	PNGImage = require('pngjs-image'),
	words = require('./words.js'),
	request = require('request');
const {
	join
} = require("path"),
	path = join(__dirname, "image.png");
let funcs = {
	rand: function(n) {
		return Math.floor(Math.random() * n);
	},
	arrayRand: function(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	},
	rgb2hsv: function(r, g, b) {
		r /= 255;
		g /= 255;
		b /= 255;
		var max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
		return [h, s, l];
	},
	randomScheme: function(msg) {
		let words = msg.content.split(' '),
			count = words[1],
			colors = [],
			dr,
			dg,
			db,
			first = new Color(funcs.rand(255), funcs.rand(255), funcs.rand(255));
		let curr = first,
			img = PNGImage.createImage(600, 600);
		if (count < 0 || count > 100 || isNaN(count)) {
			msg.reply("Invalid argument");
			return;
		}
		dr = funcs.rand(64) - 32;
		dg = funcs.rand(64) - 32;
		db = funcs.rand(64) - 32;
		for (let i = 0; i < count; i++) {
			colors.push(curr);
			curr = new Color(curr.red + dr, curr.green + dg, curr.blue + db);
		}
		let x = 0;
		let sorted = [];
		for (let c of colors) {
			let hsv = funcs.rgb2hsv(c.red, c.green, c.blue);
			let hue = hsv[0];
			let cs = {
				h: hue,
				red: c.red,
				green: c.green,
				blue: c.blue,
				alpha: 255
			}
			sorted.push(cs);
		}
		sorted.sort((a, b) => {
			return a.h - b.h;
		})
		for (let c of sorted) {
			img.fillRect(x, 0, 600 / count, 600, c);
			x += 600 / count;
		}
		img.writeImage(path, err => {
			if (err) {
				throw err;
			}
			console.log('Written to the file');
			console.log(path);
			msg.channel.sendFile(path);
		});
	},
	randomColors: function(msg) {
		let msgTxt = "",
			count = msg.content.split(' ')[1],
			err = false;
		if (!isNaN(parseInt(count))) {
			count = parseInt(count);
		} else {
			msg.reply(count + " Is not a number!");
			err = true;
		}
		if (count > 100 || count < 1) {
			msg.reply(count + " Is too high/too low. Use 100 max.");
			err = true;
		}
		if (!err) {
			let image = PNGImage.createImage(600, 600);
			let colors = []
			for (let i = 0; i < count; i++) {
				const c = new Color(funcs.rand(255), funcs.rand(255), funcs.rand(255));
				colors.push(c);
				msgTxt += `${i + 1}: [r: ${c.red}, g: ${c.green}, b: ${c.blue}] (${c.toHex()}) \n`;
			}
			let x = 0;
			for (let c of colors) {
				image.fillRect(x, 0, 600 / count, 600, c);
				x += 600 / count;
			}
			image.writeImage(path, err => {
				if (err) {
					throw err;
				}
				console.log('Written to the file');
				msg.channel.sendFile(path);
			});
			msg.reply("The chosen colors are: \n```" + msgTxt + "```");
		}
	},
	getIdea: function(msg) {
		const verbs = words.verbs,
			adjs1 = words.adjs1,
			nouns1 = words.nouns1,
			adjs2 = words.adjs2,
			nouns2 = words.nouns2,
			nouns3 = words.nouns3,
			s = ['a', 'e', 'i', 'o', 'u'];
		let str = "Ideas: \n";
		for (let i = 0; i < 3; i++) {
			let adj1 = funcs.arrayRand(adjs1),
				noun1 = funcs.arrayRand(nouns1),
				adj2 = funcs.arrayRand(adjs2),
				noun2 = funcs.arrayRand(nouns2),
				noun3 = funcs.arrayRand(nouns3),
				verb = funcs.arrayRand(verbs),
				a1 = s.indexOf(adj1[0]) != -1 ? 'an' : 'a',
				a2 = s.indexOf(adj2[0]) != -1 ? 'an' : 'a';
			let sent = `${i + 1}. ${a1} ${adj1} ${noun1} wearing ${a2} ${adj2} ${noun2} who likes ${noun3} and ${verb}`;
			str += sent;
			str += "\n";
		}
		msg.reply(str);
	},
	challenge: function(msg) {
		funcs.getIdea(msg);
		funcs.randomColors(msg);
	},
	help: function(msg, commands, prefix) {
		let str = ``;
		for (let cmd of commands) {
			if (cmd.servers.indexOf(msg.guild.id) != -1 || cmd.servers.length == 0) {
				str += `${prefix}${cmd.name}: ${cmd.desc}\n`;
			}
		}
		console.log("TEST");
		msg.reply(str);
	},
	ask: function(msg) {
		let m = '';
		msg.content.split(' ').forEach((word) => {
			m += Math.random() < 0.5 ? 'bork ' : 'bark ';
		})
		msg.channel.sendMessage(m);
	},
	idiot: function(msg) {
		msg.channel.sendMessage("Milky is an idiot");
	},
	nameify: function(msg) {
		let user = msg.author;
		msg.channel.sendMessage(`${user} is a ${msg.content.substring(6, msg.content.length)}!`);
	},
	chucknorris: function(msg) {
		request('http://api.chucknorris.io/jokes/random', (error, response, body) => {
			if (!error && response.statusCode == 200) {
				msg.reply(JSON.parse(body).value);
			}
		});
	},
	ban: function(msg) {
		if (msg.member.hasPermission("ADMINISTRATOR")) {
			let user = msg.content.split(' ').splice(1).join(' ');
			msg.channel.sendMessage(`Banned ${user}.`);
		}
	}
}

module.exports = funcs;
