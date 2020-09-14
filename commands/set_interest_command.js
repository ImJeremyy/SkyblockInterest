const CommandBase = require("./command_base");
const client = require("redis").createClient(process.env.REDIS_URL);

class SetInterestCommand extends CommandBase {
	constructor() {
		super(["setinterest"]);
	}

	/**
	 * .setinterest time <hh:mm> - in how much time will interest activate (will sync to every 31 hrs after)
	 * .setinterest channel - sets the channel where interest will be announced
	 * .setinterest role <@role> - sets the @
	 */
	run(message, args) {
		const channel = message.channel;
		const user = message.author;
		if (process.env.admin == user.id) {
			if (args.length == 1) {
				if (args[0].toLowerCase() == "channel") {
					client.set("interestChannel", channel.id);
					channel.send(user.toString() + " Set the interest channel to " + channel.id);
				} else {
					channel.send(user.toString() + " Unknown command");
				}
			} else if (args.length == 2) {
				if (args[0].toLowerCase() == "time") {
					const time = args[1];
					const split = time.split(":");
					const hours = parseInt(split[0]);
					const minutes = parseInt(split[1]);
					if (!isNaN(hours) && !isNaN(minutes)) {
						client.set("hoursLeft", hours);
						client.set("minutesLeft", minutes);

						console.log("set!");
						client.get("hoursLeft", (err, reply) => {
							console.log("set hoursLeft: " + reply.toString());
						});
						client.get("minutesLeft", (err, reply) => {
							console.log("set minutesLeft: " + reply.toString());
						});
						channel.send(user.toString() + " Set time left to next interest: " + time + " (Time will sync to 31 hrs after this period)");
					} else {
						channel.send(user.toString() + " " + args[1] + " is not a number!");
					}
				} else if (args[0].toLowerCase() == "role") {
					client.set("interestRole", args[1]);
					channel.send(user.toString() + " Set the interest role to " + args[1]);
				} else {
					channel.send(user.toString() + " Unknown command");
				}
			} else {
				channel.send(user.toString() + " Invalid amount of args.");
			}
		} else {
			channel.send(user.toString() + " You are not an admin!");
		}
	}
}

module.exports = SetInterestCommand;
