const Discord = require("discord.js");
const SetInterestCommand = require("./commands/set_interest_command");
const IdCommand = require("./commands/id_command");
const bot = new Discord.Client();

const settings = require("./settings.json");

const commands = [new IdCommand(), new SetInterestCommand()];

const client = require("redis").createClient(process.env.REDIS_URL);

const loop = () => {
	//code runs every minute
	// const readSettings = JSON.parse(fs.readFileSync(settings.path));
	client.get("hoursLeft", (err1, reply1) => {
		client.get("minutesLeft", (err2, reply2) => {
			const hoursLeft = reply1.toString();
			const minutesLeft = reply2.toString();
			console.log(hoursLeft + ":" + minutesLeft);
			if (minutesLeft > 0) {
				//if there's minutes
				minutesLeft -= 1;
			} else if (minutesLeft == 0) {
				//no minutes
				if (hoursLeft > 0) {
					//there are hours
					minutesLeft = 59;
					hoursLeft -= 1;
				} else {
					//no hours
					messageInterestChannel();
					hoursLeft = process.env.interestCycleHours;
					minutesLeft = 0;
				}
			}
			client.set("hoursLeft", hoursLeft);
			client.set("minutesLeft", minutesLeft);
		});
	});
};

function messageInterestChannel() {
	settings.interestChannels.forEach((channelId) => {
		bot.channels
			.fetch(channelId)
			.then((channel) => {
				const embed = {
					title: "Skyblock Interest",
					description: "Is now! Go online and grab it now.",
					color: 25578,
					timestamp: new Date().toString(),
				};
				channel.send(process.env.interestRole, { embed });
			})
			.catch((reason) => {
				console.log("Invalid channel id set!");
			});
	});
}

bot.on("ready", () => {
	setInterval(loop, 1 * 1000);

	console.log("Ready");
});

bot.on("message", (message) => {
	if (message.author.bot) return;

	var tmp = message.content.split(" ");
	const enteredCmd = tmp.shift().toLowerCase();
	const args = tmp;

	if (enteredCmd.startsWith(process.env.prefix)) {
		commands.forEach((command) => {
			const prefixlessEnteredCmdSplit = enteredCmd.split("");
			const prefixlessEnteredCmd = prefixlessEnteredCmdSplit.slice(1, prefixlessEnteredCmdSplit.length).join("");
			if (command.names.includes(prefixlessEnteredCmd)) {
				command.run(message, args);
			}
		});
	}
});

console.log("Loading");
bot.login(process.env.token);
