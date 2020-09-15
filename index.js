const Discord = require("discord.js");
const SetInterestCommand = require("./commands/set_interest_command");
const IdCommand = require("./commands/id_command");
const GetCommand = require("./commands/get_command");
const SetCommand = require("./commands/set_command");
const InterestCommand = require("./commands/interest_command");
const client = require("redis").createClient(process.env.REDIS_URL);
const bot = new Discord.Client();

const commands = [new IdCommand(), new SetInterestCommand(), new InterestCommand() /*,
new GetCommand(), new SetCommand()*/];

const loop = () => {
	//code runs every minute
	client.get("hoursLeft", (err1, reply1) => {
		client.get("minutesLeft", (err2, reply2) => {
			if (err1 == null || err2 == null) {
				var hoursLeft = parseInt(reply1.toString());
				var minutesLeft = parseInt(reply2.toString());
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
				set("hoursLeft", hoursLeft);
				set("minutesLeft", minutesLeft);
			} else {
				console.log("time not initialized");
			}
		});
	});
};

function set(key, value) {
	const code = () => {
		client.set(key, value);
	};
	setTimeout(code, 0.1 * 1000);
}

function messageInterestChannel() {
	client.get("interestChannel", (err1, reply1) => {
		if (err1 == null) {
			const interestChannel = reply1.toString();
			client.get("interestRole", (err2, reply2) => {
				if (err2 == null) {
					const interestRole = reply2.toString();
					bot.channels
						.fetch(interestChannel)
						.then((channel) => {
							const embed = {
								title: "Skyblock Interest",
								description: "Is now! Go online and grab it now.",
								color: 25578,
								timestamp: new Date().toString(),
							};
							channel.send(interestRole, { embed });
						})
						.catch((r) => {
							console.log("Invalid channel id set!");
						});
				} else {
					console.log("No Interest Role set");
				}
			});
		} else {
			console.log("No Channel ID set");
		}
	});
}

bot.on("ready", () => {
	setInterval(loop, 60 * 1000);
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
